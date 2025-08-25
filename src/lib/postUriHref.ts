
const uriPrefix = 'at://did:web5:'

export function postUriToHref(uri: string): string {
  const linkuri = uri.replace(uriPrefix, '')
  return encodeURIComponent(linkuri)
}

export function getPostUriHref(uri: string): string {
  const linkUri = decodeURIComponent(uri)
  return uriPrefix + linkUri
}