import {useState, useContext} from "react";
import "../../app.css";
import {Link, useNavigate} from "react-router-dom";
import {useQuery} from "react-query";
import SongBookTable from "../../components/Table";
import {allUserSongs} from "../../utils/queryKeys";
import {getUserSongs} from "../../utils/queries";
import {UserContext} from "../../Context/UserContext";

const SongList = () => {
    const {currentUser, setCurrentUser} = useContext(UserContext);
    const navigate = useNavigate();

    // Check if my user exists
    if (Object.keys(currentUser).length === 0) {
      navigate("/login");
    }
    // Fetch the songs
    const query = useQuery(
      [allUserSongs, {userId: currentUser.id}],
      getUserSongs
    )

    console.log("query", query)

  const song_headers = [
    "Title", "Artist", "Release Date"
  ]

    // ELEMENT
    return (
      <div className="app">
        {query.isLoading
          ? <div className="lds-dual-ring"></div>
          : query.data.length
            ? <SongBookTable song_headers={song_headers} rows={query.data}/>
            : <div>No Songs</div>
        }
      </div>
    )
  }
;

export default SongList;