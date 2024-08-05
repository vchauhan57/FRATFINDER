import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, Dimensions } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import {LinearGradient} from 'expo-linear-gradient';

const IndexScreen = () => {
    const initialCards = [
        { id: 1, name: "Kendrick Lamar", bio: "Engineering Major at XYZ University. Enjoys hiking and outdoor activities.", image: require('../../assets/images/kendrick.jpg') },
        { id: 2, name: "Stephen Curry", bio: "Biology Major at XYZ University. Loves painting and photography.", image: require('../../assets/images/steph.jpeg') },
        { id: 3, name: "Lebron James", bio: "You are my sunshine!", image: require('../../assets/images/lebron.jpeg')},
    ];

    const [cards, setCards] = useState(initialCards);
    const [cardIndex, setCardIndex] = useState(0);

    useEffect(() => {
        if (cardIndex >= cards.length) {
            setCardIndex(0);
        }
    }, [cardIndex, cards.length]);

    const onSwiped = () => {
        setCardIndex(prevIndex => (prevIndex + 1) % cards.length);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>FratFinder</Text>
            <Swiper
                cards={cards}
                renderCard={(card) => (
                    <View style={styles.card}>
                        <Image style={styles.image} source={card.image} />
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.8)']} // Adjust gradient colors as needed
                            style={styles.gradientOverlay}
                        >
                            <Text style={styles.name}>{card.name}</Text>
                            <Text style={styles.bio}>{card.bio}</Text>
                        </LinearGradient>
                    </View>
                )}
                onSwiped={onSwiped}
                cardIndex={cardIndex}
                infinite
                backgroundColor={'transparent'}
                stackSize={3}
                stackSeparation={15}
                disableBottomSwipe
                disableTopSwipe
                containerStyle={{ marginTop: 50 }}
                overlayLabels={{
                    left: {
                        title: 'NOPE',
                        style: {
                            label: {
                                backgroundColor: 'red',
                                borderColor: 'red',
                                color: 'white',
                                borderWidth: 1
                            },
                            wrapper: {
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                justifyContent: 'flex-start',
                                marginTop: 20,
                                marginLeft: -60
                            }
                        }
                    },
                    right: {
                        title: 'LIKE',
                        style: {
                            label: {
                                backgroundColor: 'green',
                                borderColor: 'green',
                                color: 'white',
                                borderWidth: 1
                            },
                            wrapper: {
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                                marginTop: 20,
                                marginLeft: 20
                            }
                        }
                    }
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#050505', // This is the container background color
        paddingTop: 30
    },
    logo: {
        position: 'absolute',
        top: 50,
        left: 20,
        fontSize: 30,
        fontWeight: 'bold',
        color: 'gold'
    },
    card: {
        width: Dimensions.get('window').width - 50,
        height: Dimensions.get('window').height - 200,
        borderRadius: 8,
        backgroundColor: '#FFFFFF', // Might not need this
        justifyContent: 'flex-end', // Align items to the bottom
        alignItems: 'center',
        padding: 10,
        marginTop: -10,
        margin: 5,
        overflow: 'hidden', // Important for borderRadius
    },
    image: {
        width: '100%',
        height: '100%', // Change to full height of the card
        position: 'absolute', // Position it absolutely to cover the whole card
        borderRadius: 30,
    },
    gradientOverlay: {
        width: '100%',
        height: '50%', // Cover the lower 50% of the image
        position: 'absolute',
        bottom: 0, // Start from the bottom of the card
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff', // Ensuring text is visible on the darker gradient
    },
    bio: {
        fontSize: 18,
        color: '#fff', // Ensuring text is visible on the darker gradient
        textAlign: 'center',
    }
});

export default IndexScreen;