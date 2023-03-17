import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import React, {useState, useEffect, useRef} from 'react'
import { ArtistObject, RelatedArtist } from '@/interfaces';
import styles from "@/styles/artist.module.css"
import { DataPanel } from '@/components/artist/DataPanel';
import { Discography } from '@/components/artist/Discography';
import { DiscographySlider } from '@/components/artist/DiscographySlider';
import { RelatedArtists } from '@/components/artist/RelatedArtists';
import { TopTracks } from '@/components/artist/TopTracks';

interface Props{
    artistData: ArtistObject,
    artistAlbums: Array<any>,
    artistTopTracks: Array<any>,
    artistRelatedArtists: Array<RelatedArtist>,
    appearsOn: Array<any>
}

const ArtistPage: React.FC<Props> = ({artistData, artistAlbums, artistTopTracks, artistRelatedArtists}) => {
    const div = useRef<HTMLDivElement>(null)
    const [slider, setSlider] = useState<boolean>(false)
    const handleResize = () => {
        if(div.current && div.current.scrollWidth > div.current.clientWidth) setSlider(true)
        else setSlider(false)
      }
    useEffect(()=>{
        handleResize()
        window.addEventListener("resize", handleResize, false)
    }, [])
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
                    {slider ? <DiscographySlider albums={artistAlbums}/> : <Discography albums={artistAlbums} /> }
                </div>
            </> 
            : 
            <>
                    <h1 className={styles.noAlbums}>This artist hasn't released any albums yet!</h1>
            </>}
            
        </div>
    </>)
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
                    artistData: {
                        id: artistData.id,
                        name: artistData.name,
                        genres: artistData.genres,
                        followers: artistData.followers.total.toString(),
                        img_src: artistData.images[0].url,
                        spotify_url: artistData.external_urls.spotify,
                        popularity: artistData.popularity

                    },
                    artistAlbums: artistAlbumsFiltered,
                    artistTopTracks: artistTopTracksFiltered,
                    artistRelatedArtists: artistRelatedArtists.artists.slice(0,5).map((a: any) => {
                        return {
                            id: a.id,
                            name: a.name,
                            img_src: a.images[0].url
                        }
                    }),
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