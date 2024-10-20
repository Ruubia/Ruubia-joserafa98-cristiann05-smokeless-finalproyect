"""empty message

Revision ID: f719a3068657
Revises: 
Create Date: 2024-10-17 19:47:36.350055

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f719a3068657'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('coach',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email_coach', sa.String(length=120), nullable=False),
    sa.Column('password_coach', sa.String(length=128), nullable=False),
    sa.Column('nombre_coach', sa.String(length=50), nullable=True),
    sa.Column('genero_coach', sa.String(length=10), nullable=True),
    sa.Column('nacimiento_coach', sa.Date(), nullable=True),
    sa.Column('direccion', sa.String(length=200), nullable=True),
    sa.Column('latitud', sa.Float(), nullable=True),
    sa.Column('longitud', sa.Float(), nullable=True),
    sa.Column('descripcion_coach', sa.Text(), nullable=True),
    sa.Column('public_id', sa.String(length=200), nullable=True),
    sa.Column('precio_servicio', sa.Float(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email_coach')
    )
    op.create_table('tipos_consumo',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=120), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('smoker_user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email_usuario', sa.String(length=120), nullable=False),
    sa.Column('password_email', sa.String(length=80), nullable=False),
    sa.Column('nombre_usuario', sa.String(length=80), nullable=True),
    sa.Column('genero_usuario', sa.String(length=10), nullable=True),
    sa.Column('nacimiento_usuario', sa.Date(), nullable=True),
    sa.Column('tiempo_fumando', sa.String(length=10), nullable=True),
    sa.Column('forma_consumo', sa.Integer(), nullable=True),
    sa.Column('numero_cigarrillos', sa.Integer(), nullable=True),
    sa.Column('periodicidad_consumo', sa.String(length=20), nullable=True),
    sa.Column('public_id', sa.String(length=200), nullable=True),
    sa.ForeignKeyConstraint(['forma_consumo'], ['tipos_consumo.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email_usuario')
    )
    op.create_table('mensajes',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('id_usuario', sa.Integer(), nullable=True),
    sa.Column('id_coach', sa.Integer(), nullable=True),
    sa.Column('contenido', sa.String(), nullable=False),
    sa.Column('fecha_envio', sa.DateTime(), nullable=True),
    sa.Column('visto', sa.Boolean(), nullable=True),
    sa.Column('is_coach', sa.Boolean(), nullable=True),
    sa.Column('is_user', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['id_coach'], ['coach.id'], ),
    sa.ForeignKeyConstraint(['id_usuario'], ['smoker_user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('solicitudes',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('id_usuario', sa.Integer(), nullable=False),
    sa.Column('id_coach', sa.Integer(), nullable=True),
    sa.Column('fecha_solicitud', sa.Date(), nullable=False),
    sa.Column('estado', sa.Boolean(), nullable=False),
    sa.Column('fecha_respuesta', sa.Date(), nullable=True),
    sa.Column('comentarios', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['id_coach'], ['coach.id'], ),
    sa.ForeignKeyConstraint(['id_usuario'], ['smoker_user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('solicitudes')
    op.drop_table('mensajes')
    op.drop_table('smoker_user')
    op.drop_table('tipos_consumo')
    op.drop_table('coach')
    # ### end Alembic commands ###
