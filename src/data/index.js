// @ts-nocheck
import { faker } from "@faker-js/faker";
import {
  ChatCircleDots,
  Gear,
  GearSix,
  Phone,
  SignOut,
  User,
  Users,
} from "phosphor-react";

const getAvatar = (seed) => `https://i.pravatar.cc/150?u=${seed}`;

// ---------- Original data ----------
const Profile_Menu = [
  { title: "Profile", icon: <User /> },
  { title: "Settings", icon: <Gear /> },
  { title: "Logout", icon: <SignOut /> },
];

const Nav_Buttons = [
  { index: 0, icon: <ChatCircleDots /> },
  { index: 1, icon: <Users /> },
  { index: 2, icon: <Phone /> },
];

const Nav_Setting = [
  { index: 3, icon: <GearSix /> },
];

const CallLogs = [
  { id:0, img: getAvatar(1),  name: faker.name.firstName(), missed: false, incoming: true },
  { id:1, img: getAvatar(2),  name: faker.name.firstName(), missed: true,  incoming: true },
  { id:2, img: getAvatar(3),  name: faker.name.firstName(), missed: false, incoming: false },
  { id:3, img: getAvatar(4),  name: faker.name.firstName(), missed: false, incoming: true },
  { id:4, img: getAvatar(5),  name: faker.name.firstName(), missed: true,  incoming: true },
];

const MembersList = [
  { id:0, img: getAvatar(10), name: faker.name.firstName(), online: true },
  { id:1, img: getAvatar(11), name: faker.name.firstName(), online: false },
  { id:2, img: getAvatar(12), name: faker.name.firstName(), online: true },
  { id:3, img: getAvatar(13), name: faker.name.firstName(), online: false },
  { id:4, img: getAvatar(14), name: faker.name.firstName(), online: true },
];

const ChatList = [
  { id:0, img: getAvatar(20), name: faker.name.firstName(), msg: faker.music.songName(), time: "9:36", unread:0, pinned:true, online:true },
  { id:1, img: getAvatar(21), name: faker.name.firstName(), msg: faker.music.songName(), time: "12:02", unread:2, pinned:true, online:false },
  { id:2, img: getAvatar(22), name: faker.name.firstName(), msg: faker.music.songName(), time: "10:35", unread:3, pinned:false, online:true },
  { id:3, img: getAvatar(23), name: faker.name.firstName(), msg: faker.music.songName(), time: "04:00", unread:0, pinned:false, online:true },
  { id:4, img: getAvatar(24), name: faker.name.firstName(), msg: faker.music.songName(), time: "08:42", unread:0, pinned:false, online:false },
  { id:5, img: getAvatar(25), name: faker.name.firstName(), msg: faker.music.songName(), time: "08:42", unread:0, pinned:false, online:false },
  { id:6, img: getAvatar(26), name: faker.name.firstName(), msg: faker.music.songName(), time: "08:42", unread:0, pinned:false, online:false },
  { id:7, img: getAvatar(27), name: faker.name.firstName(), msg: faker.music.songName(), time: "08:42", unread:0, pinned:false, online:false },
];

const Chat_History = [];

const Message_options = [
  { title: "Reply" },
  { title: "React to message" },
  { title: "Forward message" },
  { title: "Star message" },
  { title: "Report" },
  { title: "Delete Message" },
];

const SHARED_LINKS = [
  { type: "msg", subtype: "link", preview: faker.image.cats(), message: "Yep, I can also do that", incoming: true, outgoing: false },
  { type: "msg", subtype: "link", preview: faker.image.cats(), message: "Yep, I can also do that", incoming: true, outgoing: false },
  { type: "msg", subtype: "link", preview: faker.image.cats(), message: "Yep, I can also do that", incoming: true, outgoing: false },
  { type: "msg", subtype: "link", preview: faker.image.cats(), message: "Yep, I can also do that", incoming: true, outgoing: false },
];

const SHARED_DOCS = [
  { type: "msg", subtype: "doc", message: "Yes sure, here you go.", incoming: true, outgoing: false },
  { type: "msg", subtype: "doc", message: "Yes sure, here you go.", incoming: true, outgoing: false },
  { type: "msg", subtype: "doc", message: "Yes sure, here you go.", incoming: true, outgoing: false },
  { type: "msg", subtype: "doc", message: "Yes sure, here you go.", incoming: true, outgoing: false },
];

// ---------- Updated fallback data (Nova with app logo colour) ----------
export const FALLBACK_CHATS = [
  {
    id: 'local-1',
    name: 'Nova ai',
    img: '/favicon.ico',
    msg: 'Ready to chat? 😊',
    time: '',
    unread: 0,
    pinned: false,
    online: true,
  },
];

export const GROUP_LIST = [
  {
    id: 'group-1',
    name: 'Trip Group',
    img: '/favicon.ico',
    msg: '1 member',
    time: '',
    unread: 0,
    pinned: false,
    online: true,
    members: [
      {
        id: 'local-1',
        name: 'Nova ai',
        img: '/favicon.ico',
        msg: 'Ready to chat? 😊',
        time: '',
        unread: 0,
        online: true,
      },
    ],
  },
];

// Per‑chat message histories – only a single welcome message
export const CHAT_MESSAGES = {
  'local-1': [
    { type: "msg", message: "Hey! Ready to chat? 😊", incoming: true, outgoing: false, sender: 'Nova ai' },
  ],
  'group-1': [
    { type: "msg", message: "Welcome to the Trip Group! 🏖️", incoming: true, outgoing: false, sender: 'Nova ai' },
  ],
};

// ---------- Exports ----------
export {
  Profile_Menu,
  Nav_Setting,
  Nav_Buttons,
  ChatList,
  Chat_History,
  Message_options,
  SHARED_DOCS,
  SHARED_LINKS,
  CallLogs,
  MembersList,
};
