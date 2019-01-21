'use strict';

const reviews = {
    reviewsArray: [],

    listReview() {
        $.ajax({
            url: '../json/reviews.json',
            type: 'GET',
            dataType: 'json',
            context: this,
            success: function (data) {
                console.log(`Успешное получение данных`, data);
                for (let i = 0; i < data.reviews.length; i++) {
                    this.reviewsArray.push(data.reviews[i]);
                }
                console.log(this.reviewsArray);
                this.render();
            },
            error: function (errorObj) {
                console.log('Ошибка получения данных', errorObj);
            }
        });

    },

    render() {
        console.log(`массив в который попадает в render`, this.reviewsArray);
        let reviewsContainer = $('.reviews__all');
        for (let i = 0; i < this.reviewsArray.length; i++) {
            new Review(this.reviewsArray[i].id,
                this.reviewsArray[i].text,
                this.reviewsArray[i].author,
                this.reviewsArray[i].verified).render(reviewsContainer);
        }
    },

    addReview() {
        $.ajax({
            url: '../json/review_add.json',
            type: 'GET',
            dataType: 'json',
            context: this,
            success: function (data) {
                console.log(`Успешное получение данных при добавлении`, data);
                alert(data.userMessage)
            },
            error: function (errorObj) {
                console.log('Ошибка получения данных', errorObj);
            }
        });
        let review = $('.reviews__text');
        let name = $('.reviews__name');
        let newReview = {
            id: this.reviewsArray.length + 1,
            text: review.val(),
            author: name.val(),
            verified: 0
        };
        console.log(newReview);
        this.reviewsArray.unshift(newReview);
        console.log(`массив в addReview после добавления отзыва`, this.reviewsArray);
        this.refresh();

        review.val('');
        name.val('');
    },

    deleteReview(reviewId) {
        $.ajax({
            url: '../json/review_delete.json',
            type: 'GET',
            dataType: 'json',
            context: this,
            success: function (data) {
                console.log(data);
            },
            error: function (errorObj) {
                console.log('Ошибка получения данных', errorObj);
            }
        });
        for (let i = 0; i < this.reviewsArray.length; i++) {
            if (this.reviewsArray[i].id === +reviewId) {
                this.reviewsArray.splice(i, 1);
            }
        }
        console.log(`массив в deleteReview после удаления отзыва`, this.reviewsArray);
        this.refresh();
    },

    submitReview(reviewId) {
        $.ajax({
            url: '../json/review_submit.json',
            type: 'GET',
            dataType: 'json',
            context: this,
            success: function (data) {
                console.log(data);
            },
            error: function (errorObj) {
                console.log('Ошибка получения данных', errorObj);
            }
        });
        for (let i = 0; i < this.reviewsArray.length; i++) {
            if (this.reviewsArray[i].id === +reviewId) {
                if (this.reviewsArray[i].verified) {
                    this.reviewsArray[i].verified = 0
                } else if (!this.reviewsArray[i].verified) {
                    this.reviewsArray[i].verified = 1
                }
            }
        }
        this.refresh();
    },

    refresh() {
        console.log(`массив в refresh`, this.reviewsArray);
        $('.reviews__all').empty();
        this.render();
    }
};


class Review {
    constructor(reviewId, reviewText, reviewAuthor, reviewVerified) {
        this.reviewId = reviewId;
        this.reviewText = reviewText;
        this.reviewAuthor = reviewAuthor;
        this.reviewVerified = reviewVerified;
    }

    render(container) {
        let review;

        if (this.reviewVerified) {
            review = $('<div />', {
                class: 'review_item verified'
            });
        }

        if (!this.reviewVerified) {
            review = $('<div />', {
                class: 'review_item'
            });
        }

        let reviewText = $('<p />', {
            class: 'review_text',
            text: this.reviewText
        });

        let reviewAuthor = $('<p />', {
            class: 'review_author',
            text: this.reviewAuthor
        });

        let deleteBtn = $('<button />', {
            class: 'del_review_btn',
            'data-id': this.reviewId,
            text: 'Delete'
        });

        let submitBtn = $('<button />', {
            class: 'submit_review_btn',
            'data-id': this.reviewId,
            text: 'Submit'
        });

        reviewText.appendTo(review);
        reviewAuthor.appendTo(review);
        review.appendTo(container);
        submitBtn.appendTo(review);
        deleteBtn.appendTo(review);

    }
}

$(document).ready(function () {

    reviews.listReview();

    let reviewsContainer = $('.reviews__all');

    $('.reviews__btn').on('click', function (e) {
        e.preventDefault();
        reviews.addReview();
    });

    reviewsContainer.on('click', '.del_review_btn', function () {
        let reviewId = $(this).attr('data-id');
        reviews.deleteReview(reviewId);
    });

    reviewsContainer.on('click', '.submit_review_btn', function () {
        let reviewId = $(this).attr('data-id');
        reviews.submitReview(reviewId);
    });
});