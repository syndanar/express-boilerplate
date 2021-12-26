import {Request, Response} from 'express';
import TaskController from '@controllers/task';
import {OperationObject} from '@/types/swagger';

export const swagger: OperationObject = {
  'summary': 'Удалить задачу',
  'description': 'Удалить задачу пользователя',
  'tags': ['task'],
  'responses': {
    '204': {
      'description': 'Задача удалена',
    },
    '400': {
      'description': 'Bad request',
    },
    '404': {
      'description': 'Bad request',
    },
  },
};

export const handler = async (
    req: Request,
    res: Response,
) => {
  const controller = new TaskController();
  controller.delete(req, res).then(() => {
    console.log('status ok');
    res.status(204);
    res.send();
  }).catch((err) => {
    res.status(400);
    res.send(err.message);
  });
};
