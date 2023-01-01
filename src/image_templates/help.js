const styles = `
* {
    font-family: Rubik,sans-serif;
    color: white;
    padding: 0px;
    margin: 0px;
    box-sizing: border-box;
  }
  
  
  h1{
    text-align: center; 
    font-size: 40px;
   margin: 30px; 
   padding-top: 30px; 
    
  }
  
  
  body{
    background: #CB356B;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #BD3F32, #CB356B);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #BD3F32, #CB356B); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    width: 650px;
  
  }
  
  ul{
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    padding-bottom: 30px; 
  }
  
  li{
    font-size: 25px;
    background-color: #c5c6d0; 
    padding: 15px; 
    margin: 10px; 
    border-radius: 15px; 
    box-shadow: rgba(0, 0, 0, 0.28) 0px 3px 8px;
    color: black;
    list-style: none;
    width: 75%; 
    
  }
  
  b{
    color: black; 
    font-weight: 600; 
  }
`;

function createStaticHtml() {
  const staticHtml = `
    <h1>HELP COMMANDS</h1>
    <div class="root">${createDynamicHtml()}</div>
    `;
  return staticHtml;
}

function createDynamicHtml() {
  const ulStart = '<ul>';

  const commandsArr = [
    {
      command: '!ping',
      description: 'View the bot response time in milliseconds.',
    },
    {
      command: '@user++',
      description:
        'If a user has been helpful to you, mention their username and add ++ to give them a point.',
    },
    {
      command: '!points',
      description:
        'View the top 5 users who have attained the most points in the current channel.',
    },
    {
      command: '!ping',
      description: 'View the bot response time in milliseconds.',
    },
    {
      command: '@user++',
      description:
        'If a user has been helpful to you, mention their username and add ++ to give them a point.',
    },
    {
      command: '!points',
      description:
        'View the top 5 users who have attained the most points in the current channel.',
    },
  ];

  const commandList = commandsArr.map((commands) => {
    return `
  <li><b>${commands.command}:</b> ${commands.description} </li>
  `;
  });

  const ulEnd = '</ul>';

  const newCommandList = commandList.join('');

  const finalCommandList = ulStart + newCommandList + ulEnd;

  return finalCommandList;
}

export { styles, createStaticHtml };
