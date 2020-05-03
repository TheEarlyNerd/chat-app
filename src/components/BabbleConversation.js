import React, { Component } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { BabbleConversationMessage } from './';

const tempMessages = [
  {
    id: 1,
    text: 'Hey there all!',
    attachments: [],
    embeds: [],
    user: {
      id: 1,
      name: 'Braydon Batungbacal',
      avatarAttachment: {
        url: 'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/cp0/p80x80/71572992_2728234020533981_2005024985860538368_n.jpg?_nc_cat=105&_nc_sid=dbb9e7&_nc_oc=AQlor5czR5j0OWe6LWKnkww6UQFQamUEjTDVG0yCldx2CPuWYbFUoMsctRcXN92qYCOM__NttqoIEUEJjkE2DHtq&_nc_ht=scontent-sea1-1.xx&oh=2caea4624e8bd6ff120b532e457651f4&oe=5ED4CD6A',
      },
    },
    createdAt: '2020-05-03T00:08:45.000Z',
    updatedAt: '2020-05-03T00:08:45.000Z',
  },
  {
    id: 2,
    text: 'Gonna get this soon!',
    attachments: [],
    embeds: [
      {
        id: 1,
        title: '2017 Nissan GT-R Premium',
        description: 'Tim dahle forever warranty. NO CHARGE 100% LIFETIME POWERTRAIN WARRANTY Tim Dahle vehicles with less than 75,000 miles, 7 years and newer, non luxury or altered vehicles, come with a Lifetime Powertra...',
        url: 'https://www.carfax.com/vehicle/JN1AR5EF4HM820481',
        imageUrl: 'https://scontent-sea1-1.xx.fbcdn.net/v/t1.15752-9/95794510_909519306147771_7694676421817401344_n.jpg?_nc_cat=111&_nc_sid=b96e70&_nc_oc=AQnFFgXJBdzeIDFvM5GaWtF8TDp6KpAAvJX7mtjFJ0ONadfNDDnid1HbltZWgzMepTmhirydN4rsLWFQCLQlxcDj&_nc_ht=scontent-sea1-1.xx&oh=76fb50d4889c73a86cc090c9f8f10345&oe=5ED33147',
      },
    ],
    reactions: [
      {
        id: 1,
        reaction: '🔥',
        count: 2,
      },
      {
        id: 2,
        reaction: '🤮🤮',
        count: 1,
      },
    ],
    user: {
      id: 1,
      name: 'Braydon Batungbacal',
      avatarAttachment: {
        url: 'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/cp0/p80x80/71572992_2728234020533981_2005024985860538368_n.jpg?_nc_cat=105&_nc_sid=dbb9e7&_nc_oc=AQlor5czR5j0OWe6LWKnkww6UQFQamUEjTDVG0yCldx2CPuWYbFUoMsctRcXN92qYCOM__NttqoIEUEJjkE2DHtq&_nc_ht=scontent-sea1-1.xx&oh=2caea4624e8bd6ff120b532e457651f4&oe=5ED4CD6A',
      },
    },
    createdAt: '2020-05-03T00:09:46.000Z',
    updatedAt: '2020-05-03T00:09:46.000Z',
  },
  {
    id: 3,
    text: 'Have you seen the black one with nismo aero that is for sale on CL? Looks better imo..',
    attachments: [],
    embeds: [],
    user: {
      id: 2,
      name: 'Alex Filatov',
      avatarAttachment: {
        url: 'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/p120x120/12717707_10205908719979367_3491263903448795284_n.jpg?_nc_cat=102&_nc_sid=7206a8&_nc_oc=AQnNDgBrpVuR6mOZqnzRWUolbi5j1jbpt5s6Ot13xcQlcVcnij_FvqCSU-srog5COwEXAInPyfkreQZOx37t2zHs&_nc_ht=scontent-sea1-1.xx&_nc_tp=6&oh=163dd5603e3a77826a7a2272494104ec&oe=5ED3D3BD',
      },
    },
    createdAt: '2020-05-03T00:10:48.000Z',
    updatedAt: '2020-05-03T00:10:48.000Z',
  },
  {
    id: 4,
    text: 'Nah, link?',
    attachments: [],
    embeds: [],
    reactions: [
      {
        id: 10,
        reaction: '👍',
        count: 1,
      },
    ],
    user: {
      id: 1,
      name: 'Braydon Batungbacal',
      avatarAttachment: {
        url: 'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/cp0/p80x80/71572992_2728234020533981_2005024985860538368_n.jpg?_nc_cat=105&_nc_sid=dbb9e7&_nc_oc=AQlor5czR5j0OWe6LWKnkww6UQFQamUEjTDVG0yCldx2CPuWYbFUoMsctRcXN92qYCOM__NttqoIEUEJjkE2DHtq&_nc_ht=scontent-sea1-1.xx&oh=2caea4624e8bd6ff120b532e457651f4&oe=5ED4CD6A',
      },
    },
    createdAt: '2020-05-03T00:12:50.000Z',
    updatedAt: '2020-05-03T00:12:50.000Z',
  },
  {
    id: 5,
    text: 'Hmm not there anymore. This ones cool too.',
    attachments: [],
    embeds: [
      {
        id: 2,
        title: '2010 Nissan GT-R - $50000 (Kennewick)',
        description: '2010 Nissan GT-R 74000 Miles Clean Title All Wheel Drive Automatic Transmission Paddle Shifters Push To Start Tinted Windows GPS System Bluetooth System Drilled Slotted Rotors Brembo Breaks Recaro Seats Seibon Front Lip',
        url: 'https://seattle.craigslist.org/see/cto/d/kennewick-2010-nissan-gt/7114434890.html',
        imageUrl: 'https://images.craigslist.org/00t0t_aql8GEj2L8l_600x450.jpg',
      },
    ],
    reactions: [
      {
        id: 5,
        reaction: '🤔🤔🤔',
        count: 4,
      },
      {
        id: 6,
        reaction: 'meh',
        count: 1,
      },
    ],
    user: {
      id: 2,
      name: 'Alex Filatov',
      avatarAttachment: {
        url: 'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/p120x120/12717707_10205908719979367_3491263903448795284_n.jpg?_nc_cat=102&_nc_sid=7206a8&_nc_oc=AQnNDgBrpVuR6mOZqnzRWUolbi5j1jbpt5s6Ot13xcQlcVcnij_FvqCSU-srog5COwEXAInPyfkreQZOx37t2zHs&_nc_ht=scontent-sea1-1.xx&_nc_tp=6&oh=163dd5603e3a77826a7a2272494104ec&oe=5ED3D3BD',
      },
    },
    createdAt: '2020-05-03T00:15:48.000Z',
    updatedAt: '2020-05-03T00:15:48.000Z',
  },
  {
    id: 6,
    text: 'Bro cmon just get a lambo',
    attachments: [],
    embeds: [],
    user: {
      id: 3,
      name: 'Mo Adib',
      avatarAttachment: {
        url: 'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/cp0/p80x80/68732876_2309235119183895_7509317865388900352_n.jpg?_nc_cat=107&_nc_sid=dbb9e7&_nc_oc=AQkwIaFoJFx9KjFuQBXepGu9EpNN3o6itC0xkaIvMco-xG_XJ-NIqJ0seT6Ifa7OH8fG_0JqsNOajUV9JoG3pXvp&_nc_ht=scontent-sea1-1.xx&oh=4b6d0f7a070b4878e208b0d4b5203ca3&oe=5ED22955',
      },
    },
    createdAt: '2020-05-03T00:16:48.000Z',
    updatedAt: '2020-05-03T00:16:48.000Z',
  },
  {
    id: 7,
    text: 'Huracan mmmm... or LP-570, late 2000s model or something? Could get an R8, mine was fun lol.',
    attachments: [],
    embeds: [
      {
        id: 4,
        url: 'https://www.dupontregistry.com/autos/remote.jpg.ashx?404=default&width=580&urlb64=aHR0cDovL2NvbnRlbnQuaG9tZW5ldGlvbC5jb20vMzU4Lzk1NzIvNjQweDQ4MC8yMjcyZmEzZDUzNmI0YjIzYTQ0N2Y3NDU3OTk0NjdkYi5qcGc&hmac=ailnZiZ68X8',
        imageUrl: 'https://www.dupontregistry.com/autos/remote.jpg.ashx?404=default&width=580&urlb64=aHR0cDovL2NvbnRlbnQuaG9tZW5ldGlvbC5jb20vMzU4Lzk1NzIvNjQweDQ4MC8yMjcyZmEzZDUzNmI0YjIzYTQ0N2Y3NDU3OTk0NjdkYi5qcGc&hmac=ailnZiZ68X8',
      },
      {
        id: 5,
        url: 'https://static.cargurus.com/images/forsale/2020/03/21/05/03/2011_lamborghini_gallardo-pic-3877953573389991939-1024x768.jpeg?io=true&width=640&height=480&fit=bounds&format=jpg',
        imageUrl: 'https://static.cargurus.com/images/forsale/2020/03/21/05/03/2011_lamborghini_gallardo-pic-3877953573389991939-1024x768.jpeg?io=true&width=640&height=480&fit=bounds&format=jpg',
      },
      {
        id: 6,
        url: 'https://www.miamimotorcars.com/imagetag/117/main/l/Used-2017-Audi-R8-52-quattro-V10-Plus.jpg',
        imageUrl: 'https://www.miamimotorcars.com/imagetag/117/main/l/Used-2017-Audi-R8-52-quattro-V10-Plus.jpg',
      },
    ],
    reactions: [
      {
        id: 7,
        reaction: '😍😍😍',
        count: 3,
      },
      {
        id: 8,
        reaction: 'YUS',
        count: 1,
      },
    ],
    user: {
      id: 4,
      name: 'Thomas Chang',
      avatarAttachment: {
        url: 'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/cp0/p80x80/21752489_879003625586374_8255021344369597872_n.jpg?_nc_cat=103&_nc_sid=dbb9e7&_nc_oc=AQm6OfBh3r1iE90oxjpJPhHXwjQDWuEe59BOUloe2C2XJ2Fn6zaJfiZtE47vccdV7vczBuDSybAvICa6SMh7HeOP&_nc_ht=scontent-sea1-1.xx&oh=9620863d3d201765abff1315c0b183fb&oe=5ED26745',
      },
    },
    createdAt: '2020-05-03T00:16:48.000Z',
    updatedAt: '2020-05-03T00:16:48.000Z',
  },
  {
    id: 8,
    text: 'That superlegarra is siiiiiick',
    attachments: [],
    embeds: [],
    user: {
      id: 5,
      name: 'Max Holmes',
      avatarAttachment: {
        url: 'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/p200x200/48406353_10213592207343715_762772413514514432_o.jpg?_nc_cat=104&_nc_sid=dbb9e7&_nc_oc=AQl4SPyNrqLtJq7tJDco2bmlL0Vwg_tfzKiYffwqW5ptPTnuADY4VgK0kdKRSVbJwcvIOx7VtTTjlNv48Af6_Wl6&_nc_ht=scontent-sea1-1.xx&_nc_tp=6&oh=45f4499ac0fed75cfdba19ecf69f9647&oe=5ED1FA9A',
      },
    },
    createdAt: '2020-05-03T00:18:48.000Z',
    updatedAt: '2020-05-03T00:18:48.000Z',
  },
  {
    id: 9,
    text: 'Be careful though, the later model superlegerras are known to have issues with the lift systems and sometimes power steering pump.',
    attachments: [],
    embeds: [],
    user: {
      id: 5,
      name: 'Max Holmes',
      avatarAttachment: {
        url: 'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/p200x200/48406353_10213592207343715_762772413514514432_o.jpg?_nc_cat=104&_nc_sid=dbb9e7&_nc_oc=AQl4SPyNrqLtJq7tJDco2bmlL0Vwg_tfzKiYffwqW5ptPTnuADY4VgK0kdKRSVbJwcvIOx7VtTTjlNv48Af6_Wl6&_nc_ht=scontent-sea1-1.xx&_nc_tp=6&oh=45f4499ac0fed75cfdba19ecf69f9647&oe=5ED1FA9A',
      },
    },
    createdAt: '2020-05-03T00:18:48.000Z',
    updatedAt: '2020-05-03T00:18:48.000Z',
  },
  {
    id: 10,
    text: 'Also if you do get one and it is an e-gear, have the clutch life inspected.',
    attachments: [],
    embeds: [],
    user: {
      id: 5,
      name: 'Max Holmes',
      avatarAttachment: {
        url: 'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/p200x200/48406353_10213592207343715_762772413514514432_o.jpg?_nc_cat=104&_nc_sid=dbb9e7&_nc_oc=AQl4SPyNrqLtJq7tJDco2bmlL0Vwg_tfzKiYffwqW5ptPTnuADY4VgK0kdKRSVbJwcvIOx7VtTTjlNv48Af6_Wl6&_nc_ht=scontent-sea1-1.xx&_nc_tp=6&oh=45f4499ac0fed75cfdba19ecf69f9647&oe=5ED1FA9A',
      },
    },
    createdAt: '2020-05-03T00:18:48.000Z',
    updatedAt: '2020-05-03T00:18:48.000Z',
  },
  {
    id: 11,
    text: 'Ya bro I had my clutch inspected before buying my Gallardo, had like 30% life left, had them change it before buying.',
    attachments: [],
    embeds: [],
    user: {
      id: 3,
      name: 'Mo Adib',
      avatarAttachment: {
        url: 'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/cp0/p80x80/68732876_2309235119183895_7509317865388900352_n.jpg?_nc_cat=107&_nc_sid=dbb9e7&_nc_oc=AQkwIaFoJFx9KjFuQBXepGu9EpNN3o6itC0xkaIvMco-xG_XJ-NIqJ0seT6Ifa7OH8fG_0JqsNOajUV9JoG3pXvp&_nc_ht=scontent-sea1-1.xx&oh=4b6d0f7a070b4878e208b0d4b5203ca3&oe=5ED22955',
      },
    },
    createdAt: '2020-05-03T00:20:48.000Z',
    updatedAt: '2020-05-03T00:20:48.000Z',
  },
];

export default class BabbleConversation extends Component {
  _renderMessage = ({ item, index }) => {
    return (
      <BabbleConversationMessage
        heading={!index || tempMessages[index - 1].user.id !== item.user.id}
        {...item}
      />
    );
  }

  render() {
    const { style } = this.props;

    return (
      <FlatList
        data={tempMessages}
        renderItem={this._renderMessage}
        keyExtractor={item => `${item.id}`}
        style={[ styles.container, style ]}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
