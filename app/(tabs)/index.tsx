import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, Dimensions } from 'react-native';
import Swiper from 'react-native-deck-swiper';

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
                        <Text style={styles.name}>{card.name}</Text>
                        <Text style={styles.bio}>{card.bio}</Text>
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
        backgroundColor: '#172A45',
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
        width: Dimensions.get('window').width - 50, // Adjust card width to be close to the edges
        height: Dimensions.get('window').height - 200, // Adjust card height to be close to the edges
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        justifyContent: 'flex-start', // Align items to start at the top of the card
        alignItems: 'center',
        padding: 10,
        marginTop: -10,
        margin: 5,
    },
    image: {
        width: '100%', // Make the image take up the full width of the card
        height: Dimensions.get('window').height - 300, // Adjust image height to be proportional to the card height
        borderRadius: 8, // Remove circular shape
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 10 // Add margin top to separate from the image
    },
    bio: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
        marginTop: 10 // Add margin top to separate from the name
    }
});

export default IndexScreen;
