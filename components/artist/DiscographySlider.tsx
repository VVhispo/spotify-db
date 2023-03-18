import React, {useState, useRef, useEffect} from 'react'
import { AlbumItem } from './AlbumItem'
import styles from "@/styles/slider.module.css"
import Image from 'next/image'

interface Props{
    albums: Array<any>,
}

export const DiscographySlider: React.FC<Props> = ({albums}) => {
    const [arr_albums, setAlbums] = useState(albums)
    const mainDiv = useRef<HTMLDivElement>(null)
    const [counterRight, setCounter] = useState<number>(0)

    useEffect(()=>{
        window.addEventListener("resize", handleResize, false)
        handleResize()
    }, [])
    const handleResize = () =>{
        setAlbums(arr_albums.slice(0,Math.abs((document.body.clientWidth - 150) / 175)))
    }

    const moveRight = () => {
        if(counterRight < albums.length - 7){
            setAlbums([...albums].slice(counterRight + 1, Math.abs((document.body.clientWidth - 150) / 175) + counterRight + 1))
            setCounter(counterRight + 1)
        }
    }
    const moveLeft = () => {
        if(counterRight > 0){
            setAlbums([...albums].slice(counterRight - 1, Math.abs((document.body.clientWidth - 150) / 175) + counterRight - 1))
            setCounter(counterRight - 1)
        }
    }

    return(<div className={styles.mainCarouseleDiv} ref={mainDiv}>
        <div className={styles.arrowLeft} onClick={moveLeft}></div>
        {arr_albums.map(album=>{
            return <AlbumItem key={album.id} artist_name={album.artists[0].name} img_url={album.images[0].url} name={album.name} year={album.release_date} />
        })}
        <div className={styles.arrowRight} onClick={moveRight}></div>
    </div>)
}