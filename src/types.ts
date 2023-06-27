
export type Photo = {
  "Id": number
  "Path": string
  "Description": string
  "Order": number
  "RVId": string
}

export type ListRV = {
  "AliasName": string
  "Id": string
  "AverageRating": number
  "NumberOfReview": number
  "RVName": string
  "Guests": number
  "Distance": number
  "City": string
  "Latitude": number
  "Longitude": number
  "Photos": Photo[],
  "State": string
  "DefaultPrice": number
  "LowSeasonNight": number
  "AveragePrice": number
  "PreDiscountedTripPrice": number
  "PreDiscountedAverageNightlyPrice": number
  "DiscountedTripPrice": number
  "DiscountedAverageNightlyPrice": number
  "DiscountPercent": number
  "HasDelivery": boolean
  "DeliveryDistanceKM": number
  "InstabookOwnerOptedIn": boolean
  "RVNumber": number
  "Description": string
  "PostCode": string
  "Year": number
  "Make": string,
  "Model": string,
  "RVType": string
  "Weight": number,
  "OwnerId": number
  "IsFeatured": boolean
  "Country": string
  "AvailableDates": []
  "Timezone": string
  "IsShortStay": boolean
  "UndatedTripStart": string
  "UndatedTripEnd": string
  "UndatedTripDuration": string
}

export type SearchData = {
  FeaturedRVs: {
    Id: string
    ListRVs: ListRV[]
    TotalRVs: number
  }
  PopularRVs: {
    Id: string
    ListRVs: ListRV[]
    TotalRVs: number
  }
}

export type Filter = {
  id: string;
  label: string;
}