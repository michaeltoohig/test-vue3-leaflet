import { Directus } from '@directus/sdk'

const directusUrl = import.meta.env.VITE_DIRECTUS_URL
// const staticToken = import.meta.env.VITE_DIRECTUS_TOKEN

const directus = new Directus(directusUrl, {})

// await directus.auth.static(staticToken)

const getAssetUrl = async (assetId: string, small = false) => {
  const token = await directus.auth.token
  if (small) {
    return `${directusUrl}/assets/${assetId}?access_token=${token}&key=small`
  }
  return `${directusUrl}/assets/${assetId}?access_token=${token}&key=default`
}

export { directus, getAssetUrl }
