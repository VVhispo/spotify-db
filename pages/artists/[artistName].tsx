import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import React, {useState, useEffect, useRef} from 'react'
import { ArtistObject, ArtistReference, TrackObject, AlbumReference } from '@/interfaces';
import styles from "@/styles/artist.module.css"
import { DataPanel } from '@/components/artist/DataPanel';
import { Discography } from '@/components/artist/Discography';
import { RelatedArtists } from '@/components/artist/RelatedArtists';
import { TopTracks } from '@/components/artist/TopTracks';
import { useRouter } from 'next/router'

interface Props{
    artistData: ArtistObject,
    artistAlbums: Array<AlbumReference>,
    artistTopTracks: Array<TrackObject>,
    artistRelatedArtists: Array<ArtistReference>,
}

const ArtistPage: React.FC<Props> = ({artistData, artistAlbums, artistTopTracks, artistRelatedArtists}) => {
    const div = useRef<HTMLDivElement>(null)

    const router = useRouter()
    if (router.isFallback){
        return <div>Loading</div>
    }

    return(<>
        <div className={styles.mainDiv}>
            <div className={styles.top}>
                <div className={styles.artistInfo}>
                    <DataPanel data={artistData}/>
                </div>
                <div className={styles.artistTopTracks}>
                    <TopTracks topTracks = {artistTopTracks}/>
                </div>
                <div className={styles.artistTopTracks}>
                    <RelatedArtists relatedArtists={artistRelatedArtists}/>
            </div>
            </div>
            {artistAlbums.length > 0 ? 
            <>  
                <h1 className={styles.headerDisco}>Discography:</h1>
                <div className={styles.albumList} ref={div}>
                     <Discography albums={artistAlbums} artistId={artistData.id}/>
                </div>
            </> 
            : 
            <>
                    <h1 className={styles.noAlbums}>This artist hasn't released any albums yet!</h1>
            </>}
            
            </div>
    </>) 
}
export const getStaticPaths:GetStaticPaths = async() =>{
    return {
        paths: [
        { params: { artistName:'Placeholder'} }, //any artist
        ],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async({params}) => {
    const artistName: string = params!.artistName as string
    if(artistName === "Placeholder"){
        return{
            notFound: true
        }
    } 
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
        const artistData = formatArtistData(artistRes.artists.items[0]) //res
        if(artistData.name.length != artistName.length) throw new Error("not found") //to avoid errors like /aaa forwarding to AAAWARIA artist
        else{
            artistId = artistData.id

            const api_post = {
                method:'POST',
                body: JSON.stringify({
                    token:token,
                    artistId:artistId,
                    artist_name: artistData.name,
                }),
                headers:{ 'Content-Type':'application/json'}
            }

            const getArtistAlbums = await fetch("http:/localhost:3000/api/artist/albums", api_post)
            const artistAlbums = await getArtistAlbums.json()

            const getTopTracks = await fetch("http:/localhost:3000/api/artist/top_tracks", api_post)
            const topTracks = await getTopTracks.json()

            const getRelatedArtists = await fetch("http:/localhost:3000/api/artist/related_artists", api_post)
            const relatedArtists = await getRelatedArtists.json()

            const props: any = {
                artistData,
                artistAlbums: artistAlbums,
                artistTopTracks: topTracks,
                artistRelatedArtists: relatedArtists,
            }
            props.key = artistData.id
            return{
                props: props, 
                revalidate: 10
            }
        }
    }catch(error){
        return{
            notFound: true
        }
    }
}


const formatArtistData = (artistData: any): ArtistObject => {
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


export default ArtistPage