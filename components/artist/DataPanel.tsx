import React, {useState} from 'react'
import styles from "@/styles/artist.module.css"
import Image from 'next/image'
import Link from 'next/link'
import { ArtistObject } from '@/interfaces'

interface Props{
    data: ArtistObject
}

export const DataPanel: React.FC<Props> = ({data}) => {
    const {id, name, img_src, genres, followers, spotify_url, popularity} = data
    return(<>
        <div className={styles.data_mainDiv}>
            <Image className={styles.artistImage} key={id} src={img_src} alt={name} width="300" height="300" priority={true}></Image>
            <div className={styles.info}>
                <h1>{name}</h1>
                <p>{genres.slice(0,3).map((genre, idx) => {
                    if(idx == genres.length - 1) return genre
                    return genre + ", "
                })}</p>
                <div>
                    <h3>Spotify followers: {followers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</h3>
                    <Link href={spotify_url} prefetch={false} target="_blank" className={styles.spotifyRedirect}>Spotify profile</Link>
                </div>
                <h5>Popularity: {popularity.toString()}%</h5>

            </div>
        </div>
    </>)
}