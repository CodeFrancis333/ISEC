from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="PageView",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("visitor_id", models.CharField(db_index=True, max_length=64)),
                ("session_id", models.CharField(db_index=True, max_length=64)),
                ("path", models.CharField(db_index=True, max_length=500)),
                ("title", models.CharField(blank=True, max_length=255)),
                ("referrer", models.URLField(blank=True, max_length=1000)),
                ("source", models.CharField(blank=True, max_length=100)),
                ("user_agent", models.TextField(blank=True)),
                ("ip_address", models.GenericIPAddressField(blank=True, db_index=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True, db_index=True)),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
    ]
