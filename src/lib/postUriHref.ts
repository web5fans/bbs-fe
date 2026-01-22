
const uriPrefix = ''

export function postUriToHref(uri: string): string {
  return uri.replaceAll("at://", "at_")
                     .replaceAll(':', "_")
                     .replaceAll('/', "-");
}

export function getPostUriHref(uri: string): string {
  return uri.replaceAll("at_", "at://")
                     .replaceAll('_', ":")
                     .replaceAll('-', "/");
}

export function formatLinkParam(f: string) {
  return f.replaceAll(':', "_")
}

export function parseLinkParam(f: string) {
  return f.replaceAll('_', ":")
}