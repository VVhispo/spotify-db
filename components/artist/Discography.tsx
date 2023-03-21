import React, {useState, useRef, useEffect} from 'react'
import { AlbumItem } from './AlbumItem'
import styles from "@/styles/slider.module.css"
import { userAgentFromString } from 'next/server'

interface Props{
    albums: Array<any>,
    artistId: string,
}

export const Discography: React.FC<Props> = ({albums}) => {
    const [slider, setSlider] = useState<boolean>(true)
    const [arr_albums, setAlbums] = useState<Array<any>>(albums)
    const mainDiv = useRef<HTMLDivElement>(null)
    const [counterRight, setCounter] = useState<number>(0)

    useEffect(()=>{
        window.addEventListener("resize", handleResize, false)
        if(albums) handleResize()
    }, [])
    const handleResize = () =>{
        setAlbums([...albums].slice(counterRight, Math.abs((document.body.clientWidth - 150) / 175) + counterRight))
        if(arr_albums.slice(0,Math.abs((document.body.clientWidth - 140) / 175)).length == albums.length) setSlider(false)
    }
    const moveRight = () => {
        if(counterRight < albums.length - Math.abs((document.body.clientWidth - 150) / 175)){
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

    if(slider){
        return(<div className={styles.mainCarouseleDiv} ref={mainDiv}>
            <div className={styles.arrowLeft} onClick={moveLeft}></div>
            {arr_albums.map(album=>{
                return <AlbumItem key={album.id} artist_name={album.artists[0].name} img_url={album.images[0].url} name={album.name} year={album.release_date} />
            })}
            <div className={styles.arrowRight} onClick={moveRight}></div>
        </div>)
    }else{
        return(<div className={styles.mainCarouseleDiv} >
            {albums.map(album=>{
                return <AlbumItem key={album.id} artist_name={album.artists[0].name} img_url={album.images[0].url} name={album.name} year={album.release_date} />
            })}
        </div>)
    }

}