import { success, notFound } from '../../services/response/'
import { User } from '.'

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  User.find(query, select, cursor)
    .then((users) => users.map((user) => user.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then((user) => user ? user.view() : null)
    .then(success(res))
    .catch(next)

export const showMe = ({ user }, res) =>
  res.json(user.view(true))

export const create = ({ bodymen: { body } }, res, next) =>
  User.create(body)
    .then((user) => user.view(true))
    .then(success(res, 201))
    .catch((err) => {
      /* istanbul ignore else */
      if (err.name === 'MongoError' && err.code === 11000) {
        res.status(409).json({
          valid: false,
          param: 'email',
          message: 'email already registered'
        })
      } else {
        next(err)
      }
    })

export const update = ({ body, params, user }, res, next) =>
  User.findById(params.id === 'me' ? user.id : params.id)
    .then(notFound(res))
    .then((result) => {
      if (!result) return null
      const isAdmin = user.role === 'admin'
      const isSelfUpdate = user.id === result.id
      if (!isSelfUpdate && !isAdmin) {
        res.status(401).json({
          valid: false,
          message: 'You can\'t change other user\'s data'
        })
        return null
      }
      return result
    })

    .then((user) => {

      console.log(JSON.stringify(user))

      user.phone = body.phone
      user.email = body.email
      user.save()
    })
    //.then((user) => user ? Object.assign(user, body).save() : null)
    .then((user) => user ? user.view(true) : null)
    .then(success(res))
    .catch(next)

export const updatePassword = ({ bodymen: { body }, params, user }, res, next) =>
  User.findById(params.id === 'me' ? user.id : params.id)
    .then(notFound(res))
    .then((result) => {
      if (!result) return null
      const isSelfUpdate = user.id === result.id
      if (!isSelfUpdate) {
        res.status(401).json({
          valid: false,
          param: 'password',
          message: 'You can\'t change other user\'s password'
        })
        return null
      }
      return result
    })
    .then((user) => user ? user.set({ password: body.password }).save() : null)
    .then((user) => user ? user.view(true) : null)
    .then(success(res))
    .catch(next)

export const emergencyAlert = ({ body }, res, next) => {
  console.log(JSON.stringify(body.location))

  const query = User.find()
  query.setOptions({ lean: true })
  query.collection(User.collection)
  query.where('location').near({
    center: {
      type: 'Point',
      coordinates: [
        body.location.coords.longitude,
        body.location.coords.latitude
      ],
      maxDistance: 1000,
      spherical: true
    }
  }).exec((err, data) => {

    let usersNearby = []

    data.map(singleUser => {
      usersNearby.push({
        name: singleUser.name,
        picture: singleUser.picture,
        id: singleUser.id,
        phone: singleUser.phone
      })
    })

    usersNearby = usersNearby.slice(0, 10)

    res.status(200).json({
      usersNearby
    })

  })
}

export const refreshPosition = ({ body, user }, res, next) => {
  user.location = [body.location.coords.latitude, body.location.coords.longitude]
  user.save()
  res.status(204).send()
}

export const destroy = ({ params }, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then((user) => user ? user.remove() : null)
    .then(success(res, 204))
    .catch(next)
