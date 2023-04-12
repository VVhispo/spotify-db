import type { NextApiRequest, NextApiResponse } from 'next'
import { AlbumReference } from '@/interfaces';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<AlbumReference[]>
  ) {
    const {token, artistId} = req.body
    const outside_request = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?market=US&limit=50`,{
            headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
            },
        });
    const outside_response = await outside_request.json()
    const response = outside_response.items.filter((album: any) => { 
        return album.album_type === 'album' && album.album_group === 'album' //filter out singles
    }).filter((v:any,i:number,a:any)=>a.findIndex((v2:any)=>(v2.name===v.name))===i)
    res.status(201).json(formatToType(response))
  }
  
  const formatToType = (artistAlbums: Array<any>): Array<AlbumReference> => {
    return artistAlbums.map((a:any)=>{
        return{
            id: a.id,
            name: a.name,
            year: a.release_date.slice(0,4),
            img_src: a.images[0].url,
            artist_name: a.artists[0].name
        }
    })
}
