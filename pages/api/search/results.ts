import type { NextApiRequest, NextApiResponse } from 'next'
import { AlbumReference, ArtistReference } from '@/interfaces';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<AlbumReference[] | ArtistReference[]>
  ) {
    const {token, searchValue, searchType} = req.body
    const outside_request = await fetch(`https://api.spotify.com/v1/search?q=${searchValue!.replace(" ", "%20")}&type=${searchType}&market=US&limit=50`,{
        headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
        },
        });
    try{
        const outside_response = await outside_request.json()
        res.status(201).json(formatToType(outside_response.albums.items, searchType))
    }catch{
        res.status(500).json([])
    }
  }
  
const formatToType = (data: Array<any>, searchType: string): AlbumReference[] | ArtistReference[] => {
    if(searchType == "album"){
        return ((data.filter(a=>{
            return a.album_group == 'album' && a.album_type == 'album'
        }).map(a=>{
            return {
                id: a.id,
                artist_name: a.artists[0].name,
                img_src: a.images[0].url,
                name: a.name,
                year: a.release_date.slice(0,4)
            }
        })).filter((v:any,i:number,a:any)=>a.findIndex((v2:any)=>(v2.name===v.name && v.artist_name ===v2.artist_name))===i) //sometimes the albums are duplicated, unfixed spotify api bug
        ).splice(0, 21)
    }else if(searchType == "artist"){
        return (data.filter(a=>{
            return parseInt(a.followers.total)>1000
        }).map(a=>{
        return {
            id: a.id,
            name: a.name,
            img_src: (a.images[0].url) ?? a.images[0].url
        }
    })).splice(0, 21)
    }else return []
    
}