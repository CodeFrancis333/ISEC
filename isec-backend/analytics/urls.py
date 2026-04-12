from django.urls import path

from .views import analytics_summary, track_page_view

urlpatterns = [
    path("track/", track_page_view, name="analytics-track"),
    path("summary/", analytics_summary, name="analytics-summary"),
]
