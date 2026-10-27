export async function shareInvite(): Promise<'shared' | 'copied' | 'failed'> {
  const url = window.location.origin
  const text = 'Join me on PLACE and share your favourite spots in Aarhus.'
  try {
    if (navigator.share) {
      await navigator.share({ title: 'PLACE', text, url })
      return 'shared'
    }
    await navigator.clipboard.writeText(`${text} ${url}`)
    return 'copied'
  } catch {
    return 'failed'
  }
}
