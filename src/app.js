import mongoose from 'mongoose';
import express from 'express';
import config from './config/main.js';
import logger from './config/winston';
import Friend from './controllers/friend';
import Conversation from './controllers/conversation';
import Group from './controllers/group';
import AvatarGroup from './controllers/avatargroup';
import Message from './controllers/message';
import bodyParser from 'body-parser';

const app = express();

// RetryConnection :
function RetryConnection() {
  logger.error('MongoDB connect with retry');

  mongoose.connect(config.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

mongoose.connection.on('error', err => {
  logger.error('Database connection error: ' + err);

  setTimeout(RetryConnection, 5000);
});

mongoose.connection.on('connected', async () => {
  console.log("database connected");
  logger.info('Database connected!');
});

mongoose.connect(config.MONGO_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  
});

app.use('/jquery', express.static('/node_modules/jquery/dist/'));

app.use(express.static('src'));
app.use('/public', express.static('public'));

app.set('views', './src');
app.set('view engine', 'ejs');

app.use(bodyParser.json());                                     
app.use(bodyParser.urlencoded({extended: true}));               
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'}));  


app.route('/api/v1/friend')
  .get(Friend.GetFriend)
  .post(Friend.AddFriend)
  .delete(Friend.DeleteFriend);

app.route('/api/v1/conversation')
  .get(Conversation.GetConversation);

app.route('/api/v1/group')
  .get(Group.GetGroup)
  .post(Group.CreateGroup)
  .put(Group.AddUserToGroup)
  .delete(Group.DeleteUserInGroup);

app.route('/api/v1/avatargroup')
  .post(AvatarGroup.UploadImage);

app.route('/api/v1/message')
  .get(Message.PostMessage);

app.route('/api/v1/getMessage')
  .get(Message.GetMessage);

export default app;
