const form = document.getElementById("form");
const results = document.getElementById("result");
const search = document.getElementById("url");
const searchResultsContainer = document.getElementById('search-result-container');



let searchResults = [];
let selectedImg;

const setSearchResults = (newSearch) => {
  searchResults = newSearch;
}

search.addEventListener('change', async (e) => {
  const input = e.target.value.trim();
  if (input === '') {
    setSearchResults([]);
    searchResultsContainer.innerHTML = '';

    return;
  }
  try {
    const gifs = await searchForGif(input);
    console.log(gifs)
    displaySearchResults(gifs);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

const searchForGif = async (input) => {  
  const response = await fetch(`https://guest-book-car0.onrender.com/search?query=${encodeURIComponent(input)}`);
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }
};

const displaySearchResults = (gifs) => {
  searchResultsContainer.innerHTML = ''; 
  gifs.forEach(gif => {
    const img = document.createElement('img');
    img.src = gif.images.original.url;
    img.addEventListener('click', () => {
      const selectedGif = gif;
      
      searchResultsContainer.innerHTML = '';
      
       selectedImg = document.createElement('img');
      selectedImg.src = selectedGif.images.original.url;
      
      searchResultsContainer.appendChild(selectedImg);
    });
    searchResultsContainer.appendChild(img);
  });
};


form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const message = document.getElementById("message").value;
    const username = document.getElementById("username").value;
    const imgURL = selectedImg.src;

    

    const response = await fetch('https://guest-book-car0.onrender.com/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message, username, imgURL })
    });

    if (response.ok) {
      const newMessage = await response.json();
      console.log('New message added:', newMessage);
      displayMessages();
    } else {
      console.error('Failed to add message:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

form.addEventListener('reset', async (e) => {
  try {  e.preventDefault();
  const reset = await fetch('https://guest-book-car0.onrender.com/messages', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (reset.ok) {
    console.log('All messages deleted');

    displayMessages();

  } else {
    console.error('Failed to delete message:', response.statusText);
  }}
  catch (error) {
    console.error('Error:', error);
  }
}
);


const fetchMessages = async () => {
  const messages = await fetch('https://guest-book-car0.onrender.com/messages');
  let result = await messages.json();
return result
}



const displayMessages = async () => {
  try {
    let messages = await fetchMessages(); 
    results.replaceChildren();

    messages.forEach(message => {
      let messageDiv = document.createElement('div')
      messageDiv.setAttribute('id', message.id);
        let h3Tag = document.createElement("h3");
        let pTag = document.createElement("p");
        let img = document.createElement("img");
        let delBut = document.createElement('button')

      

        h3Tag.textContent = message.message;
        pTag.textContent = message.username;
        img.src = message.imgURL;
        delBut.textContent = 'Delete';


        messageDiv.appendChild(h3Tag);
        messageDiv.appendChild(pTag);
        messageDiv.appendChild(img);
        messageDiv.appendChild(delBut)


        results.appendChild(messageDiv)

        delBut.addEventListener('click', async (e) => {
          e.preventDefault();

          try {
            const response = await fetch(`https://guest-book-car0.onrender.com/messages/${message.id}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json'
              }
            });

            if (response.ok) {
              console.log('Message deleted:', message.id);
              displayMessages();
            } else {
              console.error('Failed to delete message:', response.statusText);
            }
          } catch (error) {
            console.error('Error:', error);
          }
        }

        )
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
};


console.log(displayMessages());
console.log(fetchMessages());
displayMessages();