import { defineStore } from 'pinia'
import leaflet from 'leaflet'
import { directus, getAssetUrl } from '@/api'

// interface Region {
//   id: string;
//   name: string;
// };

// interface Location {
//   id: string;
//   name: string;
//   region: Region;
// };

interface ListingSource {
  id: string
  name: string
  logo: string
}

interface Listing {
  id: string
  url: string
  title: string
  amount: string
  cover: string
  source: ListingSource
}

export interface Land {
  id: string
  name: string
  center: leaflet.LatLngExpression
  listings: Listing[] | null
  // polygon: GeoJSON.Polygon;
  // location: Location;
  // cover_image: string;
  // comments_en: string;
  // comments_bi: string;
  // developer_name: string;
  // developer_contact: string;
  // facebook: string;
  // link: string;
  // documents: any[];
  // median_sales_price: number;
  // median_cost_square_meter: number;
  // median_land_area: number;
  // total_lots: number;
  // has_listings: boolean;
  // service_water: string;
  // service_power: string;
}

// defines a limited subdivision object used for display on the map
export interface MapLand {
  id: string
  name: string
  has_listings: boolean
  starting_price: string | null
  polygon: GeoJSON.Polygon
  center: leaflet.LatLngExpression
}

interface LandStoreState {
  loading: Boolean
  selected: Land | null
  // selectedCoverImgSrc: string | null;
  filter: string
  history: Land[]
  lands: MapLand[]
}

export const useLandStore = defineStore('landStore', {
  state: (): LandStoreState => {
    return {
      loading: false,
      selected: null,
      // selectedCoverImgSrc: null,
      filter: 'none',
      lands: [],
      history: []
    }
  },
  actions: {
    async fetchWithinBounds(bounds: leaflet.LatLngBounds, limit: number = 100) {
      const feature = leaflet
        .polygon([
          bounds.getSouthWest(),
          bounds.getNorthWest(),
          bounds.getNorthEast(),
          bounds.getSouthEast()
        ])
        .toGeoJSON()
      const response = await directus.items('Land').readByQuery({
        limit: limit,
        fields: ['id', 'name', 'center', 'geometry', 'listings', 'listings.id', 'listings.amount'],
        filter: {
          center: {
            _intersects: feature
          }
        }
      })
      this.lands = response.data.map((s) => {
        let has_listings = s.listings.length > 0
        let polygon = s.geometry.coordinates[0].map((c) => new leaflet.LatLng(c[1], c[0]))
        return {
          id: s.id,
          name: s.name,
          has_listings: has_listings,
          starting_price: has_listings ? s.listings[0].amount : null,
          polygon: polygon,
          center: new leaflet.LatLng(s.center.coordinates[1], s.center.coordinates[0])
        }
      })
    },
    // async fetchAll(bounds: GeoJSON.Feature, limit: number = 100) {},
    async fetchOne(subdivisionId: string): Promise<Land> {
      const response = await directus.items('Land').readOne(subdivisionId, {
        fields: [
          'id',
          'name',
          'center',
          'listings.id',
          'listings.url',
          'listings.title',
          'listings.amount',
          'listings.cover',
          'listings.source.id',
          'listings.source.name',
          'listings.source.logo'
        ]
      })
      let land = response
      land.listings.forEach((l) => (l.coverImgSrc = getAssetUrl(l.cover)))
      return land
    },
    async select(landId: string) {
      try {
        this.loading = true
        const land = await this.fetchOne(landId)
        land.center = new leaflet.LatLng(land.center.coordinates[1], land.center.coordinates[0])
        console.log(`[Land] selected land ${land.id}`, land)
        this.selected = land
      } finally {
        this.loading = false
      }
    },
    unselect() {
      if (this.selected) {
        console.log('[Land] removing selected', this.selected.id)
        this.selected = null
      }
    }
  }
})
