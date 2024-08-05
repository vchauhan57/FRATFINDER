import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
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
        // Automatically reset the index to 0 when the last card is swiped
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
                containerStyle={{ marginTop: 50, marginLeft: 20 }}
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
        width: 300,
        height: 400,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    image: {
        width: 250,
        height: 250,
        borderRadius: 125,
        marginBottom: 20
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000'
    },
    bio: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center'
    }
});

export default IndexScreen;
