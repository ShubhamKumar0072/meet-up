import "./ChatPage.css"
export default function OneChat(){
    return(
        <div className="ChatPage">
            <div className="chat-header">
                Shubham Kumar
            </div>
            <div className="chat-body">
                <div className="message left">&Lorem ipsum dolor sit amet consectetur adipisicing elit. Et voluptatum a laborum? Doloremque rem eveniet qui nihil nulla accusamus sit?</div>
                <div className="message right">&Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit nisi neque, labore, modi excepturi ratione architecto vitae odio quas libero consectetur possimus minima eos nulla.</div>
                <div className="message left">&Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos, saepe.</div>
                <div className="message right">&Lorem ipsum dolor sit amet consectetur.</div>
                <div className="message left">&Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, itaque exercitationem? Fugiat totam quam doloribus praesentium optio fugit natus, enim, temporibus possimus reprehenderit accusamus iste debitis, omnis ipsum mollitia soluta sit consequuntur.</div>
            </div>
            <div className="chat-footer">
                <input className="chat-input" type="text" placeholder="Type a message"/>
                <button className="chat-send-btn">Send</button>
            </div>
        </div>
    );
}