import React, { FC, useContext } from 'react';
import Swiper from 'react-native-swiper';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { magento } from '../../magento';
import { Spinner } from '../common';
import { ThemeContext } from '../../theme';
import { MediaItem } from '../../magento/types';
import { ThemeType } from '../../theme/theme';

const ProductMedia: FC<{
  media: MediaItem[] | null;
}> = props => {
  const theme = useContext(ThemeContext);

  const renderMedia = () => {
    const { media } = props;

    if (!media) {
      return <Spinner />;
    }
    return (
      <Swiper showsPagination pagingEnabled autoplay={false}>
        {renderMediaItems()}
      </Swiper>
    );
  };

  const renderMediaItems = () => {
    const { media } = props;

    return media?.map(item => {
      console.log('media item');
      console.log(magento.getProductMediaUrl() + item.file);
      return (
        <FastImage
          key={item.id}
          style={styles.imageStyle(theme)}
          resizeMode="contain"
          source={{ uri: magento.getProductMediaUrl() + item.file }}
        />
      );
    });
  };

  return <View style={styles.imageContainer(theme)}>{renderMedia()}</View>;
};

const styles = {
  imageContainer: (theme: ThemeType) => ({
    height: theme.dimens.productDetailImageHeight,
  }),
  imageStyle: (theme: ThemeType) => ({
    height: theme.dimens.productDetailImageHeight - 10,
    top: 0,
  }),
};

export default ProductMedia;
