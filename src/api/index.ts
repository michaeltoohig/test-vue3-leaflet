import { Directus } from '@directus/sdk'

const directusUrl = import.meta.env.VITE_DIRECTUS_URL
// const staticToken = import.meta.env.VITE_DIRECTUS_TOKEN

const directus = new Directus(directusUrl, {})

// await directus.auth.static(staticToken)


const getAssetUrl = (assetId, small) => {
  if (small) {
    return `${directusUrl}/assets/${assetId}?key=small`
  }
  return `${directusUrl}/assets/${assetId}?key=default`
}

export { directus, getAssetUrl }
