import type { NextApiRequest, NextApiResponse } from 'next'
import { ArtistReference } from '@/interfaces';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ArtistReference[]>
  ) {
    const {token, artistId} = req.body
    const outside_request = await fetch(`https://api.spotify.com/v1/artists/${artistId}/related-artists`,{
            headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
            },
        });
    const outside_response = await outside_request.json()
    res.status(201).json(formatToType(outside_response))
  }
  
const formatToType = (relatedArtists: any): Array<ArtistReference> => {
    return relatedArtists.artists.slice(0,5).map((a: any) => {
        return {
            id: a.id,
            name: a.name,
            img_src: a.images[0].url
        }
    })
}
