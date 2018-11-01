import React, { Component } from 'react'
import shuffle from 'lodash.shuffle'

import './App.css'

import Card from './Card'
import GuessCount from './GuessCount'
import HighScoreInput from './HighScoreInput'
import HallOfFame from './HallOfFame'

const SIDE = 6
const SYMBOLS = '😀🎉💖🎩🐶🐱🦄🐬🌍🌛🌞💫🍎🍌🍓🍐🍟🍿'
const VISUAL_PAUSE_MSECS = 750

class App extends Component {
  state = {
    cards: this.generateCards(),
    currentPair: [], // Paire en cours de sélection
    guesses: 0, // Tentative
    hallOfFame: null,
    matchedCardIndices: [] // Tableau contenant les cartes des paires déjà réussies
  }

  // Génération des cartes 2 par 2 mélangées
  generateCards() {
    const result = []
    const size = SIDE * SIDE
    const candidates = shuffle(SYMBOLS)

    while (result.length < size) {
      const card = candidates.pop()
      result.push(card, card)
    }
    return shuffle(result)
  }


  handleCardClick = index => {
    const { currentPair } = this.state

    if (currentPair.length === 2) {
      return
    }

    if (currentPair.length === 0) {
      this.setState({ currentPair: [index] })
      return
    }

    this.handleNewPairClosedBy(index)
  }

  handleNewPairClosedBy(index) {
    const { cards, currentPair, guesses, matchedCardIndices} = this.state
    const newPair = [currentPair[0], index];
    const newGuesses = guesses + 1
    
    // victoire
    const matched = cards[newPair[0]] === cards[newPair[1]]

    // On change les valeurs pour les ajouter au tableau des cartes réussies et des victoires
    this.setState({
      currentPair: newPair,
      guesses: newGuesses
    })

    if(matched) {
      // On ajoute les nouvelles paires aux cartes déjà existantes
      this.setState({ matchedCardIndices: [...matchedCardIndices, ...newPair] })
    }

    // On efface la paire en cours au bout d'une seconde
    setTimeout(() => this.setState({ currentPair:[]}), VISUAL_PAUSE_MSECS)
  }

  getFeedbackForCard(index) {
    const { currentPair, matchedCardIndices } = this.state

    // la carte est dans le lot des paires réussies
    const indexMatched = matchedCardIndices.includes(index) // index de la carte

    // Si la paire est incomplete on laisse afficher la carte
    if (currentPair.length < 2) {
      return indexMatched || index === currentPair[0] ? 'visible' : 'hidden'
    }

    if(currentPair.includes(index)) {
      return indexMatched ? 'justMatched' : 'justMismatched'
    }

    return indexMatched ? 'visible' : 'hidden'
  }

  // Fonction appelé en callback
  displayHallOfFame = (hallOfFame) => {
    this.setState({hallOfFame})
  }

  render() {
    const { cards, guesses, hallOfFame, matchedCardIndices } = this.state

    // C'est gagné : Le tableau est égale au nombre de paires
    const won = matchedCardIndices.length === cards.length

    return (
      <div className="memory">
        <GuessCount guesses={guesses} />
        {cards.map((card, index) =>
          <Card
            card={card}
            feedback={this.getFeedbackForCard(index)}
            index={index}
            key={index}
            onClick={this.handleCardClick}
          />
        )}
        {
          won &&
            (hallOfFame ? (
              <HallOfFame entries={hallOfFame} />
            ) : (
              <HighScoreInput guesses={guesses} onStored={this.displayHallOfFame} />
            ))
        }
      </div>
    )
  }
}

export default App
