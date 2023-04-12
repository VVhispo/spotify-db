import type { NextApiRequest, NextApiResponse } from 'next'
import { ArtistObject } from '@/interfaces';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ArtistObject | null>
  ) {
    const {token, artistUrlName} = req.body
    const outside_request = await fetch(`https://api.spotify.com/v1/search?q=artist%3A${artistUrlName.replace(" ", "%20")}&type=artist`,{
            headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
            },
        });
    try{
        const outside_response = await outside_request.json()
        res.status(201).json(formatToType(outside_response.artists.items[0]))
    }catch{
        res.status(500).json(null)
    }
  }
  
const formatToType = (artistData: any): ArtistObject => {
    return{
        id: artistData.id,
        name: artistData.name,
        genres: artistData.genres,
        followers: artistData.followers.total.toString(),
        img_src: artistData.images[0].url,
        spotify_url: artistData.external_urls.spotify,
        popularity: artistData.popularity

    }
}
