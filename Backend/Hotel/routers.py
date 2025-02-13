from django.db import connections


class EnrutadorDeRespaldo:
    def db_para_lectura(self, modelo, **pistas):
        try:
            connections['default'].cursor()
            return 'default'
        except Exception:
            return 'backup'

    def db_para_escritura(self, modelo, **pistas):
        try:
            connections['default'].cursor()
            return 'default'
        except Exception:
            return 'backup'

    def permitir_relacion(self, obj1, obj2, **pistas):
        lista_db = ['default', 'backup']
        if obj1._state.db in lista_db and obj2._state.db in lista_db:
            return True
        return None

    def permitir_migracion(self, db, etiqueta_app, nombre_modelo=None, **pistas):
        # Permitir migraciones en ambas bases de datos
        return db in ['default', 'backup']