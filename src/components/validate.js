const validate = values => {
  const errors = {}
  errors.itinerary = {};
  if (!values.itinerary || !values.itinerary.title) {
    errors.itinerary.title = 'Required';
    }
  if (!values.itinerary || !values.itinerary.geo) {
    errors.itinerary.geo = 'Required';
  }
  if (values.itinerary && values.itinerary.reviews) {
    const reviewsArrayErrors = []
    values.itinerary.reviews.forEach((review, reviewIndex) => {
      const reviewErrors = {}
      // if (!review.title) {
        // reviewErrors.title = 'Required'
        // reviewsArrayErrors[reviewIndex] = reviewErrors
      // }

      
      // if (tip && member.hobbies && member.hobbies.length) {
      //   const hobbyArrayErrors = []
      //   member.hobbies.forEach((hobby, hobbyIndex) => {
      //     if (!hobby || !hobby.length) {
      //       hobbyArrayErrors[hobbyIndex] = 'Required'
      //     }
      //   })
      //   if (hobbyArrayErrors.length) {
      //     memberErrors.hobbies = hobbyArrayErrors
      //     membersArrayErrors[memberIndex] = memberErrors
      //   }
      //   if (member.hobbies.length > 5) {
      //     if (!memberErrors.hobbies) {
      //       memberErrors.hobbies = []
      //     }
      //     memberErrors.hobbies._error = 'No more than five hobbies allowed'
      //     membersArrayErrors[memberIndex] = memberErrors
      //   }
      // }
    })
    if (reviewsArrayErrors.length) {
      errors.itinerary.reviews = reviewsArrayErrors
    }
  }
  return  errors
}

export default validate