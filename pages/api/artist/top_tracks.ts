import type { NextApiRequest, NextApiResponse } from 'next'
import { TrackObject } from '@/interfaces';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<TrackObject[]>
  ) {
    const {token, artistId, artist_name} = req.body
    const outside_request = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,{
            headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
            },
        });
    const outside_response = await outside_request.json()
    const response = formatSize(outside_response.tracks, artist_name) //prioritize own tracks over features but always return 5
    res.status(201).json(formatToType(response))
  }
  
const formatToType = (TopTracks: Array<any>): Array<TrackObject> => {
    return TopTracks.map(track=>{
        return {
            id: track.id,
            name:track.name,
            album_name:track.album.name,
            album_id:track.album.id,
            img_src:track.album.images[0].url,
            artists: track.artists.map((a:any)=>{
                return {
                    id:a.id,
                    name:a.name,
                    img_src: null,
                }
            }),
        }
    })
}

const formatSize = (TopTracks: Array<any>, artist_name: string): Array<any> => {
    let artistTopTracksFiltered = TopTracks.filter((track: any) => {
        return track.album.artists.map((t: any) => t.name).includes(artist_name) && track.album.album_type=="album"
    })
    const artistOwnTopTracks = [...artistTopTracksFiltered]
    if(artistOwnTopTracks.length < 5){
        const length:number = [...artistOwnTopTracks].length
        for(let i=0; i<(5-length); i++){
            artistTopTracksFiltered.push(
                TopTracks.filter((n:any) => !artistOwnTopTracks.includes(n))[i]
            )
        }
    }else if(artistTopTracksFiltered.length > 5){
        artistTopTracksFiltered = artistTopTracksFiltered.slice(0,5)
    }
    return artistTopTracksFiltered
}