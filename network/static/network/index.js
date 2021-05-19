
document.addEventListener('DOMContentLoaded', function() {

// allow to take the numbers from page links and input them in the showpage() function
    document.addEventListener('click', event =>{
    const element = event.target;
    const pagenum = parseInt(element.textContent)
    if (element.className === "page-link") {
        history.pushState({"pagenumber" : pagenum}, "",`${pagenum}`);
        showpage(pagenum)  
    }
    })
    document.addEventListener('click', event =>{
        const element = event.target;
        if (element.className.includes("like") ) {
            id = parseInt(element.id.slice(4));
            add_like(id);
            show_likes(id)
        }
        })

window.onpopstate = function(event) {
    showpage(event.state.pagenumber);
}
history.pushState({"pagenumber" : 1}, "",'1');
showpage(1)
})

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function showpage(num){
    const singlepage = document.getElementById(`postpage${num}`);
    const pages = document.getElementsByClassName('postpage');
    if (pages.lenght === 0) {
        page(num);
    }
    else if (singlepage === null && pages.lenght !=0){
        for (var i=0;i<pages.length;i+=1) {
            pages[i].style.display = 'none'
        }
        page(num)
    }
    else{
        for (var i=0;i<pages.length;i+=1) {
            pages[i].style.display = 'none'
        }
        singlepage.style.display = 'block';
    }
}
    

function page(num){
    console.log('test')
    Promise.all([
        fetch(`/posts/${num}`),
        fetch('/likes')
    ])
    .then(allresponses => {
        const posts = allresponses[0].json();
        const likes = allresponses[1].json();
        return {posts : posts, likes : likes}
    })
    .then(function(totalpost) {
        posts = totalpost.posts.then( posts =>{
    
        // Create a division for each page
        const postpage = document.createElement('div');
        postpage.classList.add('postpage');
        postpage.id = `postpage${num}`
        document.getElementsByClassName('postspace')[0].appendChild(postpage);

        // Create division for each post
        posts.forEach(post => {
        const postelement = document.createElement('div');
        postelement.classList.add('post');
        postelement.id = post.id;
        document.getElementById(`postpage${num}`).appendChild(postelement);

        // Create division for username
        const username = document.createElement('p');
        username.classList.add('username');
        username.innerHTML = post['user'];
        document.getElementById(`${post.id}`).appendChild(username)
        
        // Create division for edits
        // Make edit unavailable if user did not make the post
        const ucheck = document.getElementById('usercheck');
        if (ucheck != null){
            const usercheck = ucheck.textContent
        if (usercheck === post['user']){
            const edit = document.createElement('div');
            edit.classList.add('editpost');
            edit.id = `editpost${post.id}`
            edit.innerHTML = 'Edit';
            document.getElementById(`${post.id}`).appendChild(edit);
        }
        }

        // Create division for post content
        const postcontent = document.createElement('div');
        postcontent.classList.add('postcontent');
        postcontent.innerHTML = post['post'];
        document.getElementById(`${post.id}`).appendChild(postcontent);

        // Create division for timestamp
        const timestamp = document.createElement('p');
        timestamp.classList.add('timestamp');
        timestamp.innerHTML = `Posted on: ${post['timestamp']}`;
        document.getElementById(`${post.id}`).appendChild(timestamp);
        
        // Create division for likes
        const likese = document.createElement('i');
        likese.className = 'like bi bi-hand-thumbs-up'
        likese.id = `like${post.id}`
        likese.style.display = 'inline-block'
        const likesf = document.createElement('i');
        likesf.className = 'like full bi bi-hand-thumbs-up-fill'
        likesf.id = `likf${post.id}`
        likesf.style.display = 'none'
        const likenum = document.createElement('span');
        likenum.classList.add('likenum')
        likenum.id = `likenum${post.id}`
        likenum.innerHTML = 0
        likenum.style.display = 'inline-block'
        document.getElementById(`${post.id}`).appendChild(likese);
        document.getElementById(`${post.id}`).appendChild(likesf);
        document.getElementById(`${post.id}`).appendChild(likenum);

        // Create division for comments
        const comments = document.createElement('div');
        comments.classList.add('comments')
        comments.id = `comments${post.id}`
        comments.innerHTML = 'Comments'
        document.getElementById(`${post.id}`).appendChild(comments);
    })

    })
    console.log('testlike')
    // Like section - numbers and icons
    likes = totalpost.likes.then(likes => {
        console.log('testlike2')
        const likenum = document.getElementsByClassName('likenum');
        for (var i=0;i<likenum.length;i+=1) {
            console.log(i) 
            let likecount = 0;
            let userctrl = 0
            const ucheck = document.getElementById('usercheck');
            const likesymbol = document.getElementById(`like${likenum[i].id.slice(7)}`);
            const likesymbolf = document.getElementById(`likf${likenum[i].id.slice(7)}`);
            likes.forEach(like =>{
                console.log(parseInt(likenum[i].id.slice(7)))
                if (like.post_id === parseInt(likenum[i].id.slice(7))){
                    likecount += 1;
                    
                }
                if (like.post_id === parseInt(likenum[i].id.slice(7)) && ucheck.textContent === like.username){
                    userctrl = 1;
                }
            })
            if (userctrl === 1){
                likesymbol.style.display = 'none'
                likesymbolf.style.display = 'inline-block'
            }
            likenum[i].innerHTML = likecount;
                }
            })
    })
}

// Function adds likes to DB still need to add current add to page
function add_like(postid){
    console.log('post')
    const csrftoken = getCookie('csrftoken');
    const username = document.getElementById('usercheck').textContent;
    postid = postid;
    const request = new Request(
        '/likes',
        {headers: {'X-CSRFToken': csrftoken}}
        )
    
    // Post new like into DB
    fetch(request, {
        method: 'POST',
        mode: 'same-origin',
        body: JSON.stringify({
            username: username,
            post: postid
        })
        
      })
    .then(response => {
            response.json();
        })

    .catch(error => console.log('error:', error));
    }


function show_likes(postid){
    // Get all likes from DB
    console.log('show')
    fetch('/likes')
    .then(response => response.json())
    .then(likes =>{
        let likecount = 0
        let userctrl = 0
        const ucheck = document.getElementById('usercheck');
        likes.forEach(like =>{
            if (like.post_id === postid && like.username === ucheck.textContent){
                likecount += 1
                userctrl = 1
            }
        })
        const likesymbol = document.getElementById(`like${postid}`);
        const likesymbolf = document.getElementById(`likf${postid}`);
        const likenumber = document.getElementById(`likenum${postid}`);
        likenumber.innerHTML = likecount;
        if (userctrl === 1){
            likesymbol.style.display = 'none';
            likesymbolf.style.display = 'inline-block';
        }
        else{
            likesymbol.style.display = 'inline-block';
            likesymbolf.style.display = 'none';
        }
    })
    .catch(error => console.log('error:', error));
}


