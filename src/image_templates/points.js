const listOfUserPoints = (caller, arr) => {
	return arr.map((user,index) => {
		
		const { username, points } = user;
		const { id, avatar } = user.user
		const defaultPic = "https://cdn.discordapp.com/embed/avatars/0.png";
		const src = `https://cdn.discordapp.com/avatars/${id}/${avatar}.webp`;
		const imgSrc = !avatar ? defaultPic : src;
		const isCaller = caller === username ? "pointUser" : "";


		return `
<div class="userInfo ${isCaller}">
  <img src="${imgSrc}" class="user-avatar" >
  <span class="place">#${index + 1}</span>
   <span class="name">${username}</span>
  <span class="points">${points}</span>
 </div>
 `
}).join('');
}


const leaderBoardBody = (channelName, caller, usersArr, listOfUsers = listOfUserPoints) => {
	const usersList = listOfUsers(caller, usersArr);
	return `
<h1>LEADERBOARD</h1>
<span class="channel-name">#${channelName}</span>
<div class="userInfo" style="background-color: #0F6284;">
  <span class="user-avatar">Avatar</span>
  <span class="place">Place</span>
   <span class="name">Name</span>
  <span class="points">Points</span>
 </div>
${usersList}
`
}


const styles = `
* {
  font-family: Rubik,sans-serif;
  color: white;
  padding: 0px;
  margin: 0px;
  box-sizing: border-box;
  font-weight: 600;
}

body {
  background-color: #1B2137;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 520px;
  padding: 20px;
  --yellow: #eec73c;
}

h1 {
  color: white;
  color:var(--yellow);
}
.channel-name {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #00C6C0;
}
.userInfo {  
  margin-bottom: 5px;
  display: grid;
  width: 90%;
  background-color: #434655;
  padding: 5px 0px;
  border-radius: 7px;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 1fr;
  grid-auto-flow: row;
  align-items: center;
  justify-items: center;
  grid-template-areas:
    "avatar place name name points";
}

.pointUser {
  background-color: #C8CCEA;
  color: #1B2137;
}

.user-avatar { 
  grid-area: avatar; 
  border-radius: 04px;
  width: 40px;
  justify-self: flex-start;
  margin-left: 10px;
}

.place { 
  grid-area: place; 
  justify-self: self-start;
  color: inherit;
}

.points { 
	grid-area: points; 
	color: inherit;}

.name { 
  grid-area: name; 
  max-width: 200px;
  text-overflow: ellipsis;
  max-height: 55px;
  overflow: hidden;
  color: inherit;
}

`

export { leaderBoardBody, styles }
