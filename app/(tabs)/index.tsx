import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Image, Dimensions, Animated } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { LinearGradient } from 'expo-linear-gradient';
import { useDragging } from './DraggingContext';
import { Modal, TouchableOpacity } from 'react-native';

const IndexScreen = () => {
    const initialCards = [
        { id: 1, name: "Kendrick Lamar", bio: "Engineering Major at XYZ University. Enjoys hiking and outdoor activities.", image: require('../../assets/images/kendrick.jpg') },
        { id: 2, name: "Stephen Curry", bio: "Biology Major at XYZ University. Loves painting and photography.", image: require('../../assets/images/steph.jpg') },
        { id: 3, name: "LeBron James", bio: "You are my sunshine!", image: require('../../assets/images/lebron.jpg') },
        { id: 4, name: "Abel Tesfaye", bio: "We had s*x in the studio, nobody's watching", image: require('../../assets/images/abel.png') },
    ];
    const { setIsDragging, setSwipeDirection } = useDragging();
    const [cards, setCards] = useState(initialCards);
    const [cardIndex, setCardIndex] = useState(0);
    const animatedValues = useRef(initialCards.map(() => new Animated.Value(0))).current;
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);

    useEffect(() => {
        if (cards.length !== animatedValues.length) {
            animatedValues.current = cards.map(() => new Animated.Value(0));
        }
    }, [cards.length]);

    const onSwiped = (index) => {
        setCardIndex(prevIndex => (prevIndex + 1) % cards.length);
        resetAnimatedValue(index);
        setIsDragging(false);
        setSwipeDirection(null);
    };

    const onSwiping = (x) => {
        const index = cardIndex;
        if (Math.abs(x) > 1) {
            if (index < animatedValues.length) {
                animatedValues[index].setValue(x);
            }
            setIsDragging(true);
            setSwipeDirection(x > 0 ? 'right' : 'left');
        } else {
            setIsDragging(false);
            setSwipeDirection(null);
        }
    };

    const onSwipedAborted = () => {
        resetAnimatedValue(cardIndex);
        setIsDragging(false);
        setSwipeDirection(null);
    };

    const resetAnimatedValue = (index) => {
        if (index < animatedValues.length) {
            Animated.timing(animatedValues[index], {
                toValue: 0,
                duration: 0,
                useNativeDriver: false,
            }).start();
        }
    };

    const interpolateGlowColor = (index) => animatedValues[index].interpolate({
        inputRange: [-Dimensions.get('window').width / 2, 0, Dimensions.get('window').width / 2],
        outputRange: ['red', '#fff', 'green'], // Glow colors
        extrapolate: 'clamp'
    });

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>fratch.</Text>
            <Swiper
                cards={cards}
                renderCard={(card, index) => {
                    const glowColor = interpolateGlowColor(index);

                    return (
                        <View style={styles.cardContainer}>
              <Animated.View style={[styles.imageContainer, {
    shadowColor: glowColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1, // Maximized for more vivid color visibility
    shadowRadius: 5, // Reduced for a sharper, less diffuse glow
    elevation: 5 // Adjusted elevation for Android to match the less diffuse glow
}]}>
    <Image style={styles.image} source={card.image} />
    <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)', 'rgba(0,0,0,1.1)']}
        style={styles.gradientOverlay}
    >
        <Text style={styles.name}>{card.name}</Text>
        <Text style={styles.bio}>{card.bio}</Text>
    </LinearGradient>
</Animated.View>

                        </View>
                    );
                }}
                onSwiped={onSwiped}
                onSwiping={(x) => onSwiping(x)}
                onSwipedAborted={onSwipedAborted}
                cardIndex={cardIndex}
                infinite
                backgroundColor={'transparent'}
                stackSize={3}
                stackSeparation={15}
                disableBottomSwipe
                disableTopSwipe
                containerStyle={{ marginTop: 50 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#050505',
        paddingTop: 30
    },
    logo: {
        position: 'absolute',
        top: 50,
        left: 20,
        fontSize: 30,
        fontWeight: 'bold',
        color: '#91760d'
    },
    cardContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width - 50,
        height: Dimensions.get('window').height - 200,
    },
    imageContainer: {
        width: '100%',
        height: '100%',
        borderRadius: 40, // This applies the border radius uniformly
        overflow: 'visible', // Make sure this is set to visible to see the shadow
        padding: 10, // Adjust if needed to give space for the shadow
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 40, // Ensure the borderRadius here matches the container
    },
    gradientOverlay: {
        width: '100%',
        height: '30%',
        position: 'absolute',
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderBottomLeftRadius: 40, // match this with the imageContainer borderRadius
        borderBottomRightRadius: 40, // match this with the imageContainer borderRadius
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    bio: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
    }
});

export default IndexScreen;
