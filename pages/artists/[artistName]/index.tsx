import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import React, {useState, useEffect} from 'react'
import { Artist } from '@/components/artist/Artist';

interface Props{
    artistData: any,
    artistAlbums: Array<any>,
    artistTopTracks: Array<any>,
    artistRelatedArtists: Array<any>,
    appearsOn: Array<any>
}

const ArtistPage: React.FC<Props> = ({artistData, artistAlbums, artistTopTracks, artistRelatedArtists}) => {
    return(
        <>
            <Artist generalData={artistData} albums={artistAlbums} topTracks={artistTopTracks} relatedArtists={artistRelatedArtists}/> 
        </> 
    )
}

export const getServerSideProps: GetServerSideProps = async({params}) => {
    const artistName: string = params!.artistName as string

    const response = await fetch("http:/localhost:3000/api/getAccessToken")
    const { token } = await response.json()

    const artist = await fetch(`https://api.spotify.com/v1/search?q=artist%3A${artistName!.replace(" ", "%20")}&type=artist`,{
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    });
    let artistId: string | null
    try{ 
        const artistRes = await artist.json()
        const artistData = artistRes.artists.items[0] //res
        if(artistData.name.length != artistName.length) throw new Error("not found") //to avoid errors like /aaa forwarding to AAAWARIA artist
        else{
            artistId = artistData.id

            const artistAlbumsReq = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums`,{
            headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
            },
            });
            const artistAlbums = await artistAlbumsReq.json()
            const artistAlbumsFiltered = artistAlbums.items.filter((album: any) => { //res
                return album.album_type === 'album' && album.album_group === 'album' //filter out singles
            })

            const appearsOn = artistAlbums.items.filter((album: any) => { //res
                return album.album_group === 'appears_on' //filter out singles
            })

            const artistTopTracksReq = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,{
                headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
                },
                });
            const artistTopTracks = await artistTopTracksReq.json() //res
            const artistTopTracksFiltered = validateTopTracks(artistTopTracks.tracks, artistData.name)
            
            const artistRelatedArtistsReq = await fetch(`https://api.spotify.com/v1/artists/${artistId}/related-artists`,{
                headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
                },
                });
            const artistRelatedArtists = await artistRelatedArtistsReq.json() //res
            return{
                props: {
                    artistData,
                    artistAlbums: artistAlbumsFiltered,
                    artistTopTracks: artistTopTracksFiltered,
                    artistRelatedArtists: artistRelatedArtists.artists.slice(0,5),
                    appearsOn
                }
            }
        }
    }catch(error){
        console.log(error)
        return{
            notFound: true
        }
    }
}

const validateTopTracks = (TopTracks: Array<any>, artist_name: string): Array<any> => {
    let artistTopTracksFiltered = TopTracks.filter((track: any) => {
        
        return track.album.artists.map((t: any) => t.name).includes(artist_name) && track.album.album_type=="album"
    })
    if(artistTopTracksFiltered.length < 5){
        const length:number = [...artistTopTracksFiltered].length
        for(let i=0; i<(5-length); i++){
            artistTopTracksFiltered.push(
                TopTracks.filter((n:any) => !artistTopTracksFiltered.includes(n))[i]
            )
        }
    }else if(artistTopTracksFiltered.length > 5){
        artistTopTracksFiltered = artistTopTracksFiltered.slice(0,5)
    }
    return artistTopTracksFiltered
}

export default ArtistPage