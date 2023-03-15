import React, {useEffect, useState} from 'react'
import styles from "@/styles/artist.module.css"
import { DataPanel } from './DataPanel'
import { TopTracks } from './TopTracks'
import { RelatedArtists } from './RelatedArtists'
import { Discography } from './Discography'
import { DiscographySlider } from './DiscographySlider'

interface Props{
    generalData: any,
    albums: Array<any>,
    topTracks: Array<any>,
    relatedArtists: Array<any>
}

export const Artist: React.FC<Props> = ({generalData, albums, topTracks, relatedArtists}) => {
    const checkSlider = (arrLength: number):boolean =>{
        return true
    }
    return(<>
        <div className={styles.mainDiv}>
            <div className={styles.top}>
                <div className={styles.artistInfo}>
                    <DataPanel name={generalData.name} genres={generalData.genres} followers={generalData.followers.total.toString()} 
                    img_src={generalData.images[0].url} spotify_url={generalData.external_urls.spotify} popularity={generalData.popularity}/>
                </div>
                <div className={styles.artistTopTracks}>
                    <TopTracks topTracks = {topTracks}/>
                </div>
                <div className={styles.artistTopTracks}>
                    <RelatedArtists relatedArtists={relatedArtists}/>
            </div>
            </div>
            <h1 className={styles.headerDisco}>Discography:</h1>
            <div className={styles.albumList}>
                {checkSlider(albums.length) ? <Discography albums={albums} /> : <DiscographySlider albums={albums}/>}
            </div>
        </div>
    </>)
}