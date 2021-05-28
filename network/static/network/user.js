
document.addEventListener('DOMContentLoaded', function() {

    // Takes the numbers from page links and input them in the showpage() function
        document.addEventListener('click', event =>{
        const element = event.target;
        const pagenum = parseInt(element.textContent)
        if (element.className === "page-link") {
            history.pushState({"pagenumber" : pagenum}, "",`${pagenum}`);
            showpage(pagenum)  
        }
        })
    // Adds likes to DB and display them in page
        document.addEventListener('click', event =>{
            const element = event.target;
            if (element.className.includes("like") ) {
                id = parseInt(element.id.slice(4));
                add_like(id);
            }
            })
    
    // Show and hides edit separator
        document.addEventListener('click', event =>{
            const element = event.target;
            if (element.className.includes("editpost") ) {
                id = parseInt(element.id.slice(8));
                editarea = document.getElementById(`editarea${id}`)
                postarea = document.getElementById(`postcontent${id}`)
                if (editarea.style.display === 'none'){
                    editarea.style.display = 'block';
                    postarea.style.display = 'none';
                    
                }
                else{
                    editarea.style.display = 'none';
                    postarea.style.display = 'block';
                }
            }
            })
    
            document.addEventListener('click', event =>{
                const element = event.target;
                if (element.className.includes("commentstitle") ) {
                    id = parseInt(element.id.slice(13));
                    commentarea = document.getElementById(`comments${id}`)
                    if (commentarea.style.display === 'none'){
                        commentarea.style.display = 'block';
                        showcomments(id)
    
                    }
                    else{
                        commentarea.style.display = 'none';
                    }
                }
                })
    
            // Makes the edits to posts
            document.addEventListener('click', event =>{
                const element = event.target;
                if (element.className.includes("subedit")) {
                    id = parseInt(element.id.slice(7));
                    edit(id)
                }
            })
    
            // Posts new comment
            document.addEventListener('click', event =>{
                const element = event.target;
                if (element.className.includes("subcomment")) {
                    id = parseInt(element.id.slice(10));
                    newcomment(id)
                }
            })
    
            // pushes page number to url
            window.onpopstate = function(event) {
                showpage(event.state.pagenumber);
            }
            history.pushState({"pagenumber" : 1}, "",'1');
            
            // Load first page by default
            showpage(1);
    })
    
    // From Django guide
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
            page(num);
          
        }
        else{
            for (var i=0;i<pages.length;i+=1) {
                pages[i].style.display = 'none'
            }
            singlepage.style.display = 'block';
        }
    }
        
    
    function page(num){
        fetch(`/posts/${num}`)
        .then(responses => {
            const posts = responses.json();
            return {posts : posts}
        })
        .then(function(mainpost) {
            posts = mainpost.posts.then( posts =>{
        
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
            postcontent.id = `postcontent${post.id}`;
            postcontent.innerHTML = post['post'];
            postcontent.style.display = 'block';
    
            // Create division for edits
            const editarea = document.createElement('form');
            editarea.classList.add('editarea');
            editarea.id = `editarea${post.id}`;
            const editpost = document.createElement('textarea');
            editpost.classList.add('epost');
            editpost.id = `epost${post.id}`;
            editpost.innerHTML = post['post'];
            const subedit = document.createElement('button');
            subedit.className = 'subedit btn btn-sm btn-outline-primary'
            subedit.id = `subedit${post.id}`
            subedit.innerHTML = 'Edit'
            editarea.style.display = 'none'
            document.getElementById(`${post.id}`).appendChild(editarea);
            document.getElementById(`editarea${post.id}`).appendChild(editpost);
            document.getElementById(`editarea${post.id}`).appendChild(subedit);
            document.getElementById(`${post.id}`).appendChild(postcontent);
    
            // Alter textarea properties
            editpost.rows = 4
            editpost.cols = 40
            editpost.maxLength = 500
            subedit.type = 'submit'
    
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
            // Title / button
            const commentstitle = document.createElement('p');
            commentstitle.classList.add('commentstitle')
            commentstitle.id = `commentstitle${post.id}`
            commentstitle.innerHTML = 'Comments'
            document.getElementById(`${post.id}`).appendChild(commentstitle);
    
            // Comment area
            const comments = document.createElement('div');
            comments.className = 'comments';
            comments.id = `comments${post.id}`
            comments.style.display = 'none'
            document.getElementById(`${post.id}`).appendChild(comments);
            
            
            // Textarea for new comment and submit button
            const commentform = document.createElement('form');
            commentform.className = 'commentform';
            commentform.id = `commentform${post.id}`;
    
            const newcomment = document.createElement('textarea');
            newcomment.classList.add('newcomment');
            newcomment.id = `newcomment${post.id}`;
    
            const subcomment = document.createElement('button');
            subcomment.className = 'subcomment btn btn-sm btn-outline-primary'
            subcomment.id = `subcomment${post.id}`
            subcomment.innerHTML = 'Comment'
            
            document.getElementById(`comments${post.id}`).appendChild(commentform);
            document.getElementById(`commentform${post.id}`).appendChild(newcomment);
            document.getElementById(`commentform${post.id}`).appendChild(subcomment);
    
            // Alter Comment area properties
            newcomment.rows = 4
            newcomment.cols = 40
            newcomment.maxLength = 500
            subcomment.type = 'submit'
    
        })
        })
        })
        .then(()=> show_likes())
    }
    
    
    // Function adds likes to DB still need to add current add to page
    function add_like(postid){
        const csrftoken = getCookie('csrftoken');
        const username = document.getElementById('usercheck').textContent;
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
        .then( ()=> show_likes())
        .catch(error => console.log('error:', error));
        }
    
    
    function show_likes(){
        // Get all likes from DB
        fetch('/likes')
        .then(response => response.json())
        .then(likes =>{
            const likenums = document.querySelectorAll('.likenum');
            for (likenum of likenums){ 
                let likecount = 0;
                let userctrl = 0
                const ucheck = document.getElementById('usercheck');
                const likesymbol = document.getElementById(`like${likenum.id.slice(7)}`);
                const likesymbolf = document.getElementById(`likf${likenum.id.slice(7)}`);
                likes.forEach(like =>{
                    if (like.post_id === parseInt(likenum.id.slice(7))){
                        likecount += 1;
                        
                    }
                    if (like.post_id === parseInt(likenum.id.slice(7)) && ucheck.textContent === like.username){
                        userctrl = 1;
                    }
                })
                if (userctrl === 1){
                    likesymbol.style.display = 'none'
                    likesymbolf.style.display = 'inline-block'
                }
                else{
                    likesymbol.style.display = 'inline-block'
                    likesymbolf.style.display = 'none'
                }
                likenum.innerHTML = likecount;
                
            }
        })
        .catch(error => console.log('error:', error));
    }
    
    function edit(postid) {
        const csrftoken = getCookie('csrftoken');
        const request = new Request(
            `edit/${postid}`,
            {headers: {'X-CSRFToken': csrftoken}}
            )
        const editpost = document.getElementById(`epost${postid}`).value
            fetch(request, {
                method: 'PUT',
                mode: 'same-origin',
                body: JSON.stringify({
                    post: editpost
                })
            })
    }
    
    function newcomment(postid){
        const csrftoken = getCookie('csrftoken');
        const request = new Request(
            `comment/${postid}`,
            {headers: {'X-CSRFToken': csrftoken}}
            )
        const comment = document.getElementById(`newcomment${postid}`).value
        const username = document.getElementById('usercheck').textContent;
    
            fetch(request, {
                method: 'POST',
                mode: 'same-origin',
                body: JSON.stringify({
                    comment: comment,
                    username : username
                })
            })
    }
    
    function showcomments(postid) {
        fetch(`/comment/${postid}`)
        .then(response => response.json())
        .then(comments =>{
            const commentarea = document.createElement('div');
            commentarea.className = 'commentarea';
            commentarea.id = `commentarea${postid}`;
            if (document.getElementById(`commentarea${postid}`) === null){
                document.getElementById(`comments${postid}`).appendChild(commentarea);
            }
            comments.forEach(comment =>{
    
                const timestamp = document.createElement('p');
                timestamp.classname = 'commentdate';
                timestamp.id = `commentdate${comment['id']}`;
                timestamp.innerHTML = `Comment posted on: ${comment['timestamp']}`;
                
                const user = document.createElement('p');
                user.classname = 'commentuser';
                user.id = `commentuser${comment['id']}`;
                user.innerHTML = `By: ${comment['username']}`;
                
                const commentcontent = document.createElement('p');
                commentcontent.className = 'commentcontent';
                commentcontent.id = `commentcontent${comment['id']}`
                commentcontent.innerHTML = `${comment['comment']}`
    
                const divider = document.createElement('hr');
                divider.className = 'divider';
    
                if (document.getElementById(`commentdate${comment['id']}`) === null){
                    document.getElementById(`commentarea${postid}`).appendChild(timestamp);
                    
                }
                if (document.getElementById(`commentuser${comment['id']}`) === null){
                    document.getElementById(`commentarea${postid}`).appendChild(user);
                    
                }
                if (document.getElementById(`commentcontent${comment['id']}`) === null){
                    document.getElementById(`commentarea${postid}`).appendChild(commentcontent);
                    document.getElementById(`commentarea${postid}`).appendChild(divider);
                }
            })
        })
    }
    