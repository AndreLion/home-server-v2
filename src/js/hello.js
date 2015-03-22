var data = [
    {author: "Pete Hunt", text: "This is one commentt"},
    {author: "Jordan Walke", text: "This is *another* commentt"}
];

var CommentBox = React.createClass({
    getInitialState:function(){
        return {
            data:[]
        };
    },
    componentDidMount:function(){
        this.loadCommentsFromServer();
        //setInterval(this.loadCommentsFromServer, this.props.pollInterval)
    },
    loadCommentsFromServer:function(){
        $.ajax({
            dataType:'json',
            url:this.props.url,
            success:function(data){
                this.setState({data:data});
            }.bind(this),
            error:function(xhr,state,err){
                console.error(this.props.url,status,err.toString());
            }.bind(this)
        });
    },
    handleCommentSubmit: function(comment){
        var comments = this.state.data;
        var newComments = comments.concat([comment]);
        this.setState({data:newComments});
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: comment,
            success: function(data) {
                //this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function(){
        return (
            <div className="commentBox">
                <h2>Comments</h2>
                <CommentList data={this.state.data}/>
                <CommentForm onCommentSubmit={this.handleCommentSubmit} />
            </div>
        );
    }
});

var CommentList = React.createClass({
    render:function(){
        var commentNodes = this.props.data.map(function(comment){
            return (
                <Comment author={comment.author}>
                    {comment.text}
                </Comment>
            );
        });
        return (
            <div className="commentList">
                {commentNodes}
            </div>
        );
    }
});

var CommentForm = React.createClass({
    handleSubmit: function(e){
        e.preventDefault();
        var author = React.findDOMNode(this.refs.author).value.trim();
        var text = React.findDOMNode(this.refs.text).value.trim();
        if(!text || !author){
            return ;
        }
        this.props.onCommentSubmit({author:author,text:text});
        React.findDOMNode(this.refs.author).value = '';
        React.findDOMNode(this.refs.text).value = '';
        return ;
    },
    render: function(){
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Your name" ref="author" />
                <input type="text" placeholder="Say sth..." ref="text" />
                <input type="submit" value="Post" />
            </form>
        );
    }
});

var converter = new Showdown.converter();

var Comment = React.createClass({
    render: function(){
        var rawMarkup = converter.makeHtml(this.props.children.toString());
        return (
            <div className="comment">
                <h3 className="commentAuthor">
                    {this.props.author}
                </h3>
                <span dangerouslySetInnerHTML={{__html:rawMarkup}} />
            </div>
        );
    }
});

React.render(
    <CommentBox url="comments.json" pollInterval={2000} />,
    document.getElementById('content')
);
