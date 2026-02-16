import { v } from "convex/values";
import { query } from "./_generated/server";

export const getByIdWithDetails = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product || product.status !== "published") return null;

    // Get download count
    const downloads = await ctx.db
      .query("downloads")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();

    return {
      ...product,
      thumbnailUrl: product.thumbnailId
        ? await ctx.storage.getUrl(product.thumbnailId)
        : null,
      downloadCount: downloads.length,
    };
  },
});

export const search = query({
  args: {
    searchTerm: v.optional(v.string()),
    category: v.optional(
      v.union(
        v.literal("ebook"),
        v.literal("template"),
        v.literal("formation"),
        v.literal("kit"),
        v.literal("script"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    let products = await ctx.db
      .query("products")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    // Filter by category
    if (args.category) {
      products = products.filter((p) => p.category === args.category);
    }

    // Filter by search term
    if (args.searchTerm && args.searchTerm.trim() !== "") {
      const term = args.searchTerm.toLowerCase();
      products = products.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term),
      );
    }

    products.sort((a, b) => {
      const aTime = a.publishedAt ?? a._creationTime;
      const bTime = b.publishedAt ?? b._creationTime;
      return bTime - aTime;
    });

    return Promise.all(
      products.map(async (product) => ({
        ...product,
        thumbnailUrl: product.thumbnailId
          ? await ctx.storage.getUrl(product.thumbnailId)
          : null,
      })),
    );
  },
});

export const listPublished = query({
  args: {
    category: v.optional(
      v.union(
        v.literal("ebook"),
        v.literal("template"),
        v.literal("formation"),
        v.literal("kit"),
        v.literal("script"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    let products = await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("status"), "published"))
      .collect();

    // Filter by category if provided
    if (args.category) {
      products = products.filter((p) => p.category === args.category);
    }

    // Add thumbnail URLs
    return Promise.all(
      products.map(async (product) => ({
        _id: product._id,
        _creationTime: product._creationTime,
        title: product.title,
        description: product.description,
        category: product.category,
        isNouveau: product.isNouveau,
        thumbnailUrl: product.thumbnailId
          ? await ctx.storage.getUrl(product.thumbnailId)
          : null,
      })),
    );
  },
});

export const listNew = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_nouveau", (q) => q.eq("isNouveau", true))
      .collect();

    const published = products.filter((p) => p.status === "published");

    return Promise.all(
      published.map(async (product) => ({
        ...product,
        thumbnailUrl: product.thumbnailId
          ? await ctx.storage.getUrl(product.thumbnailId)
          : null,
      })),
    );
  },
});

export const getById = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) return null;

    return {
      ...product,
      thumbnailUrl: product.thumbnailId
        ? await ctx.storage.getUrl(product.thumbnailId)
        : null,
    };
  },
});

export const getCount = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    const newProducts = products.filter((p) => p.isNouveau);

    return {
      total: products.length,
      new: newProducts.length,
    };
  },
});
