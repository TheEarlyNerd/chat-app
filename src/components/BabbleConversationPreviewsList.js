import React, { Component } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { BabbleConversationPreview } from './';

export default class BabbleConversationPreviewsList extends Component {
  _renderConversationPreview = ({ item, index }) => {
    return (
      <BabbleConversationPreview conversation={item} />
    );
  }

  render() {
    const { conversations, style, ...props } = this.props;

    return (
      <FlatList
        data={conversations}
        renderItem={this._renderConversationPreview}
        keyExtractor={item => `${item.id}`}
        style={[ styles.container, style ]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        {...props}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    marginBottom: 10,
    paddingTop: 10,
  },
});
