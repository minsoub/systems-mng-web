import cx from 'classnames';
import CloseButton from '../../assets/images/icons/close-circle.svg';
import './styles.scss';

export default function Tag({ title, isDelete, onClick, onDeleteClick, style }) {
    return (
        <div className={cx('tag--container')}>
            <button className={cx({ delete_btn: isDelete })} onClick={onClick}>
                <span>{title}</span>
                {isDelete && (
                    <button
                        className="button-delete"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDeleteClick && onDeleteClick();
                        }}
                    >
                        <img src={CloseButton} alt="" />
                    </button>
                )}
            </button>
        </div>
    );
}
