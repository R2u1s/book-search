import React from 'react';
import styles from './card.module.css';
import { TBookInfo } from '../../types/types';
import { useDispatch } from '../../services/hooks';
import { writeBookInfo } from '../../services/actions/books';

export const Card: React.FC<{ book: TBookInfo, openModal: () => void }> = ({ book, openModal }) => {

  const dispatch = useDispatch();

  const picture = book.volumeInfo?.imageLinks?.smallThumbnail ? book.volumeInfo?.imageLinks?.smallThumbnail : 'Нет изображения';
  const categories = book.volumeInfo?.categories ? book.volumeInfo?.categories.join(', ') : 'Категории не заданы';
  const title = book.volumeInfo?.title ? book.volumeInfo?.title : 'Нет названия';
  const authors = book.volumeInfo?.authors ? book.volumeInfo?.authors.join(', ') : 'Авторы не найдены';

  return (
    <>
      <div
        className={`${styles['_content']}`}
        onClick={() => {
          openModal();
          dispatch(writeBookInfo(book)); //записываем инфо о книге в хранилище, чтобы открыть в отдельном окне
        }}>
        <div className={`${styles['_picture-padding']}`}>
          <img src={picture} className={`${styles['_picture']}`} />
        </div>
        <div className={`${styles['_category']}`}>
          <p className={'text text_type_underline text_color_gray text_overflow_one'}>{categories}</p>
        </div>
        <div className={`${styles['_title']}`}>
          <p className={'text text_type_bold text_color_black text_overflow_three'}>{title}</p>
        </div>
        <div className={`${styles['_authors']}`}>
          <p className={'text text_type_default text_color_gray text_overflow_one'}>{authors}</p>
        </div>
      </div>
    </>
  );
}

