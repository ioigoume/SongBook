import {useState, useContext} from "react";
import "../../app.css";
import {Link, useNavigate} from "react-router-dom";
import {useQuery} from "react-query";
import SongBookTable from "../../components/Common/Table";
import {allUserSongs} from "../../utils/queryKeys";
import {getUserSongs} from "../../utils/queries";
import {UserContext} from "../../Context/UserContext";

const SongList = () => {
    const {currentUser, setCurrentUser} = useContext(UserContext);
    const navigate = useNavigate();
    const stored_user = JSON.parse(localStorage.getItem('logged_in_user'))

    // Retrieve the stored user from the local storage
    if (Object.keys(stored_user).length !== 0) {
      setCurrentUser(stored_user)
    }

    // Check if my user exists
    if (Object.keys(currentUser).length === 0) {
      navigate("/login");
    }
    // Fetch the songs
    const query = useQuery(
      [allUserSongs, {userId: currentUser.id}],
      getUserSongs
    )

    const song_headers = [
      "ID", "Title", "Artist", "Release Date"
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