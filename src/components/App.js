import React from 'react';
import Header from './Header';
import Main   from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import EditAvatarPopup from './EditAvatarPopup';
import EditProfilePopup from './EditProfilePopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';
import api from '../utils/api';
import CurrentUserContext from '../contexts/CurrentUserContext';
import avatarDefault from '../images/profile__avatar.jpg'


export default function App() {
  const [currentUser, setCurrentUser] = React.useState({
    _id: 0,
    name: 'Жак-Ив Кусто',
    about: 'Исследователь океана',
    avatar: avatarDefault
  });
  React.useEffect(() => {
    api.getUserData()
    .then(userData => {
      setCurrentUser(userData)
    })
    .catch(error => { console.log(error); });
  }, []);

  function handleUpdateUser({ name, about }) {
    api.setUserData({ name, about })
    .then((user) => {
      setCurrentUser(user);
      closeAllPopups();
    })
    .catch(error => { console.log(error); });
  }

  function handleUpdateAvatar(url) {
    api.setUserAvatar(url)
    .then((user) => {
      setCurrentUser(user);
      closeAllPopups();
    })
    .catch(error => { console.log(error); });
  }



  const [cards, setCards] = React.useState([]);
  React.useEffect(() => {
    api.getCards()
    .then(cards => { setCards(cards); })
    .catch(error => { console.log(error); });
  }, []);

  function handleCardLike(card) {
    const isLiked = card.likes.some(like => like._id === currentUser._id);

    api.toggleLike(card._id, isLiked)
    .then((newCard) => {
      const newCards = cards.map((c) => c._id === card._id ? newCard : c);
      setCards(newCards);
    })
    .catch(error => { console.log(error); });
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)
    .then(() => {
      const newCards = [];
      cards.forEach((c) => {
        if (c !== card) newCards.push(c);
      });
      setCards(newCards);
    })
    .catch(error => { console.log(error); });
  }

  function handleAddPlaceSubmit({ name, link }) {
    api.addCard({ name, link })
    .then(newCard => {
      setCards([newCard, ...cards]);
      closeAllPopups();
    })
    .catch(error => { console.log(error); });
  }



  const [isEditAvatarPopupOpen, openAvatarPopup] = React.useState(false);
  function handleEditAvatarClick() {
    openAvatarPopup(true);
  }

  const [isEditProfilePopupOpen, openProfilePopup] = React.useState(false);
  function handleEditProfileClick() {
    openProfilePopup(true);
  }

  const [isAddPlacePopupOpen, openPlacePopup] = React.useState(false);
  function handleAddPlaceClick() {
    openPlacePopup(true);
  }

  const [selectedCard, setSelectedCard] = React.useState(null);
  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handlePopupClose(event) {
    if (
      event.target.classList.contains('popup__button-close') ||
      event.target === event.currentTarget
    ) {
      closeAllPopups();
    }
  }

  function closeAllPopups() {
    openAvatarPopup(false);
    openProfilePopup(false);
    openPlacePopup(false);
    setSelectedCard(null);
  }


  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="root">
        <Header />
        <Main
          cards={cards}
          onEditAvatar={handleEditAvatarClick}
          onEditProfile={handleEditProfileClick}
          onAddPlace={handleAddPlaceClick}
          onCardClick={handleCardClick}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
        />
        <Footer />
      </div>


      <EditAvatarPopup
        onUpdateAvatar={handleUpdateAvatar}
        isOpen={isEditAvatarPopupOpen}
        onClose={handlePopupClose}
      />


      <EditProfilePopup
        onUpdateUser={handleUpdateUser}
        isOpen={isEditProfilePopupOpen}
        onClose={handlePopupClose}
      />


      <AddPlacePopup
        onAddPlace={handleAddPlaceSubmit}
        isOpen={isAddPlacePopupOpen}
        onClose={handlePopupClose}
      />


      <PopupWithForm
        name="confirmation"
        title="Вы уверены?"
        submitButtonText="Да"
      >
      </PopupWithForm>

      <ImagePopup card={selectedCard} onClose={handlePopupClose} />
    </CurrentUserContext.Provider>
  );
}
