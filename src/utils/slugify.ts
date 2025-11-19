export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\_]+/g, "-")          // replace spaces & underscores with hyphen
    .replace(/[^\w\-]+/g, "")          // remove all non-word characters
    .replace(/\-\-+/g, "-")            // replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, "");          // remove leading or trailing hyphens
}
