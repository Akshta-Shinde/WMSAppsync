export const onCreateBook=`
    subscription MySubscription {
        onCreateBook {
            author
            bookId
            description
            price
            title
        }
    }
`

// export const onCreateItemMaster=`
//     subscription MySubscription {
//         onCreateItemMaster {
//             skuId
//             skuDesc
//         }
//     }
// `