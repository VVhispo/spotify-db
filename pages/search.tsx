import React, {useEffect, useState} from 'react'
import { SearchBar } from '@/components/search/SearchBar'
import { searchType, ArtistReference, AlbumReference } from '@/interfaces'
import styles from '@/styles/search.module.css'
import { SearchAlbumItem} from '@/components/search/SearchAlbumItem'
import { SearchArtistItem } from '@/components/search/SearchArtistItem'
import { NewReleases } from '@/components/NewReleases'

const SearchPage: React.FC = () => {
    const [searchType, setSearchType] = useState<searchType>("album")
    const [searchValue, setSearchValue] = useState<string>()
    const [access_token, setToken] = useState<string | undefined>()
    const [search_results, setSearchResults] = useState<Array<ArtistReference> | Array<AlbumReference>>()

    const getToken = async () => {
        const response = await fetch("api/getAccessToken")
        const { token } = await response.json()
        setToken(token)
    }   

    useEffect(()=>{
        if(!access_token) getToken()
        else getSearchResults()
    }, [searchValue, searchType, access_token])

    
    const getSearchResults = async() => {
        if(searchValue === undefined) return
        const res = await fetch(`https://api.spotify.com/v1/search?q=${searchValue!.replace(" ", "%20")}&type=${searchType}&market=US&limit=50`,{
        headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json"
        },
        });
        const result = await res.json()
        if(result.error) return
        let data;
        (searchType == "album") ? data = formatAlbums(result.albums.items) : data = formatArtists(result.artists.items);
        setSearchResults(data)
    }


    const formatAlbums = (albums: Array<any>): Array<AlbumReference> => {
        return ((albums.filter(a=>{
            return a.album_group == 'album' && a.album_type == 'album'
        }).map(a=>{
            return {
                id: a.id,
                artist_name: a.artists[0].name,
                img_src: a.images[0].url,
                name: a.name,
                year: a.release_date.slice(0,4)
            }
        })).filter((v:any,i:number,a:any)=>a.findIndex((v2:any)=>(v2.name===v.name && v.artist_name ===v2.artist_name))===i)
        ).splice(0, 21)
    }

    const formatArtists = (artists: Array<any>): Array<ArtistReference> => {
        return (artists.filter(a=>{
                return parseInt(a.followers.total)>1000
            }).map(a=>{
            return {
                id: a.id,
                name: a.name,
                img_src: (a.images[0].url) ?? a.images[0].url
            }
        })).splice(0, 21)
    }

    return(<div className={styles.mainDiv}>
        <div className={styles.searchBar}>
            <SearchBar setSearchValue={setSearchValue} setSearchType={setSearchType} />
        </div>
        <div className={styles.searchResults}>
            {(searchValue !== undefined) ? search_results?.map((item: ArtistReference | AlbumReference) => {                
                return (searchType == "album") ? <SearchAlbumItem key={item.id} data={item as AlbumReference}/> : <SearchArtistItem key={item.id} data={item as ArtistReference}/>
            }):
            <NewReleases />
            }
        </div>

    </div>)
}

export default SearchPage